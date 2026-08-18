// src/app/api/log-activity/route.ts
// Route handler for recording login/logout activity events from client modals or server calls

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { recordUserActivityLog } from '@/lib/activityLogger'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const eventType = body.eventType === 'logout' ? 'logout' : 'login'

    await recordUserActivityLog(user, eventType)

    return NextResponse.json({ success: true, user: user.email, eventType })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('API log-activity error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
