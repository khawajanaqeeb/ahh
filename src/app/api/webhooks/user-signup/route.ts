import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Make sure to add RESEND_API_KEY to your .env.local
const resend = new Resend(process.env.RESEND_API_KEY)

// The email address you want to receive notifications at
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ahhbrothers.com' 

export async function POST(req: Request) {
  try {
    // Optional: Validate a secret header to ensure this request comes from YOUR Supabase
    // const authHeader = req.headers.get('Authorization')
    // if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
    //   return new NextResponse('Unauthorized', { status: 401 })
    // }

    const body = await req.json()
    
    // The payload shape depends on how you configured the Supabase webhook.
    // Assuming you send the raw 'record' from the database trigger:
    const record = body.record || body

    const { data, error } = await resend.emails.send({
      from: 'AHH Brothers <onboarding@resend.dev>', // Update this to your verified domain later
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
