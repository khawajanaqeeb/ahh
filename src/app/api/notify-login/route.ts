import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, phone, cnic, loginTime } = body

    const resendApiKey = process.env.RESEND_API_KEY
    const companyEmail =
      process.env.COMPANY_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'ahhbrothers.developers@gmail.com'

    if (!resendApiKey || resendApiKey.includes('your_resend_api_key_here')) {
      console.log(
        `[LOGIN NOTIFICATION LOG] User: ${fullName} (${email}), CNIC: ${cnic}, Phone: ${phone}, Time: ${loginTime}`
      )
      return NextResponse.json({ ok: true, dev: true })
    }

    const resend = new Resend(resendApiKey)
    const result = await resend.emails.send({
      from: 'AHH Brothers <onboarding@resend.dev>',
      to: [companyEmail],
      subject: `🔐 User Login – ${fullName || email}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 16px; border: 1px solid #334155; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px;">🔐 User Login Notification</h2>
          <p style="font-size: 14px; color: #cbd5e1;">A registered client has logged in to the AHH Brothers portal:</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 16px 0;" />
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
            <tr>
              <td style="padding: 10px 0; color: #94a3b8; width: 160px;"><strong>Full Name:</strong></td>
              <td style="padding: 10px 0; font-weight: bold;">${fullName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8;"><strong>CNIC:</strong></td>
              <td style="padding: 10px 0; font-weight: bold; color: #f59e0b;">${cnic || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Phone:</strong></td>
              <td style="padding: 10px 0;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; color: #38bdf8;">${email || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Login Time:</strong></td>
              <td style="padding: 10px 0;">${loginTime || new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) + ' (PKT)'}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 16px 0;" />
          <p style="font-size: 11px; color: #64748b; margin-bottom: 0;">
            This notification was sent automatically to ${companyEmail}.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error('Resend login email error:', result.error)
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
    }

    console.log(`[notify-login] Email sent to ${companyEmail} for user: ${email}`)
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('notify-login error:', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
