import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isEmailAdmin } from '@/lib/constants'

export async function GET() {
  try {
    const supabase = await createClient()

    // Verify the requesting user is an admin or accounts role
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const hasAdminEmail = isEmailAdmin(user.email)
    let isAuthorized = hasAdminEmail || user.user_metadata?.role === 'admin'

    if (!isAuthorized) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      isAuthorized = profile?.role === 'admin' || profile?.role === 'accounts'
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all activity logs (server client carries the admin session → RLS passes)
    const { data, error: fetchError } = await supabase
      .from('user_activity_logs')
      .select('*')
      .order('timestamp', { ascending: false })

    if (fetchError) {
      console.error('Activity logs fetch error:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('Activity logs API error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
