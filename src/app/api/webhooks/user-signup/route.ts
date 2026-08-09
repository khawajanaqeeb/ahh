import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// The email address you want to receive notifications at
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ahhbrothers.developers@gmail.com'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey.includes('your_resend_api_key_here')) {
      console.warn('RESEND_API_KEY is missing or invalid.')
      return NextResponse.json({ message: 'Resend API key not configured' }, { status: 200 })
    }

    const resend = new Resend(apiKey)
    const body = await req.json()
    
    // The payload shape depends on how you configured the Supabase webhook.
    // Assuming you send the raw 'record' from the database trigger:
    const record = body.record || body

    const { data, error } = await resend.emails.send({
      from: 'AHH Brothers <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `🚨 New User Registration: ${record.full_name || 'A user'}`,
      html: `
        <h2>New User Registered on AHH Brothers</h2>
        <p><strong>Name:</strong> ${record.full_name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${record.phone || 'N/A'}</p>
        <p><strong>ID:</strong> ${record.id}</p>
        <p><strong>Role:</strong> ${record.role}</p>
        <hr />
        <p><em>This is an automated notification from your Supabase integration.</em></p>
      `,
    })

    if (error) {
      console.error('Error sending email via Resend:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    console.error('Webhook Error:', error.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
