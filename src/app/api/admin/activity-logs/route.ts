import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isEmailAdmin } from '@/lib/constants'

export async function GET() {
  try {
    const supabase = await createClient()

    // Verify the requesting user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role via email allowlist + user metadata (no DB query needed
    // for known admin emails, avoids profiles RLS recursion entirely)
    const hasAdminEmail = isEmailAdmin(user.email)
    const hasAdminMeta = user.user_metadata?.role === 'admin'

    if (!hasAdminEmail && !hasAdminMeta) {
      // Only hit the DB as a last resort — use the SECURITY DEFINER function
      // to avoid RLS recursion on profiles
      const { data: roleData, error: roleErr } = await supabase
        .rpc('get_user_role', { lookup_user_id: user.id })

      if (roleErr) {
        console.error('Role check error:', roleErr.message)
        return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 500 })
      }

      const role = roleData as string | null
      if (role !== 'admin' && role !== 'accounts') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Fetch all activity logs from very beginning — try RPC first, fallback to direct table select
    let logs: any[] = []
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_activity_logs')

    if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
      logs = rpcData
    } else {
      // Direct table query fallback for complete history from very beginning
      const { data: tableData, error: tableError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10000)

      if (!tableError && tableData) {
        logs = tableData
      } else if (Array.isArray(rpcData)) {
        logs = rpcData
      } else if (tableError && rpcError) {
        console.error('Activity logs fetch error:', rpcError, tableError)
        return NextResponse.json({ error: rpcError?.message || tableError?.message }, { status: 500 })
      }
    }

    return NextResponse.json({ data: logs || [] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('Activity logs API error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
