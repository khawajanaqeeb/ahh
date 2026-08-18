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

    // Determine user role
    let role = 'user'
    if (isEmailAdmin(user.email)) {
      role = 'admin'
    } else {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()
        if (profile?.role) {
          role = profile.role
        } else {
          const { data: roleData } = await supabase.rpc('get_user_role', { lookup_user_id: user.id })
          if (roleData) role = roleData as string
        }
      } catch {
        const { data: roleData } = await supabase.rpc('get_user_role', { lookup_user_id: user.id })
        if (roleData) role = roleData as string
      }
    }

    // 1. Try RPC insert first (bypasses RLS)
    const { error: rpcError } = await supabase.rpc('insert_activity_log', {
      p_user_id: user.id,
      p_user_email: user.email || 'Unknown',
      p_user_role: role,
      p_event_type: eventType,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    })

    // 2. Fallback to direct table insertion if RPC is missing or fails
    if (rpcError) {
      const { error: tableError } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          user_email: user.email || 'Unknown',
          user_role: role,
          event_type: eventType,
          ip_address: ipAddress,
          user_agent: userAgent,
          timestamp: new Date().toISOString(),
        })

      if (tableError) {
        console.warn('Direct insert into user_activity_logs notice:', tableError.message)
      }
    }
  } catch (err) {
    console.error('Failed to record user activity log:', err)
  }
}
