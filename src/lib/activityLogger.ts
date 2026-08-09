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
 * Server-side helper to record login/logout activity events in Supabase
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

    // Determine user role
    let role = 'user'
    if (isEmailAdmin(user.email)) {
      role = 'admin'
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
        
      if (profile?.role) {
        role = profile.role
      }
    }

    const { error } = await supabase.from('user_activity_logs').insert({
      user_id: user.id,
      user_email: user.email || 'Unknown',
      user_role: role,
      event_type: eventType,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (error) {
      console.warn('Supabase activity log record notice:', error.message)
    }
  } catch (err) {
    console.error('Failed to record user activity log:', err)
  }
}
