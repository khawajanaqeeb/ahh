import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { isEmailAdmin } from '@/lib/constants'

export interface UserActivityLog {
  id?: string
  user_id: string | null
  user_email: string
  user_role: string
  event_type: 'login' | 'logout'
  timestamp?: string
  ip_address?: string | null
  user_agent?: string | null
}

/**
 * Server-side helper to record login/logout activity events in Supabase.
 * Uses a SECURITY DEFINER RPC function to bypass RLS and avoid
 * infinite recursion on profiles policies.
 */
export async function recordUserActivityLog(
  user: { id: string; email?: string | null },
  eventType: 'login' | 'logout'
) {
  try {
    const supabase = await createClient()
    const headerList = await headers()
    
    // Extract IP address from standard headers
    const forwardedFor = headerList.get('x-forwarded-for')
    const realIp = headerList.get('x-real-ip')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'Unknown IP')
    
    // Extract User Agent
    const userAgent = headerList.get('user-agent') || 'Unknown Device'

    // Determine user role — use email check first to avoid hitting profiles RLS
    let role = 'user'
    if (isEmailAdmin(user.email)) {
      role = 'admin'
    } else {
      // Use SECURITY DEFINER function to bypass profiles RLS recursion
      const { data: roleData } = await supabase
        .rpc('get_user_role', { lookup_user_id: user.id })
        
      if (roleData) {
        role = roleData as string
      }
    }

    // Use SECURITY DEFINER function to insert the log (bypasses RLS)
    const { error } = await supabase.rpc('insert_activity_log', {
      p_user_id: user.id,
      p_user_email: user.email || 'Unknown',
      p_user_role: role,
      p_event_type: eventType,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    })

    if (error) {
      console.warn('Supabase activity log record notice:', error.message)
    }
  } catch (err) {
    console.error('Failed to record user activity log:', err)
  }
}
