'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'
import { recordUserActivityLog } from '@/lib/activityLogger'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const redirectUrl = (formData.get('redirect') as string)?.trim()

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    if (data?.user) {
      await recordUserActivityLog(data.user, 'login')

      // Fire-and-forget company notification email on login
      const resendApiKey = process.env.RESEND_API_KEY
      const companyEmail = process.env.COMPANY_EMAIL || process.env.ADMIN_EMAIL || 'ahhbrothers.developers@gmail.com'
      const loginTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) + ' (PKT)'
      const fullName = data.user.user_metadata?.full_name || 'N/A'

      if (resendApiKey && !resendApiKey.includes('your_resend_api_key_here')) {
        const resend = new Resend(resendApiKey)
        resend.emails.send({
          from: 'AHH Brothers <onboarding@resend.dev>',
          to: [companyEmail],
          subject: `🔐 User Login Alert: ${email}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 16px; border: 1px solid #334155;">
              <h2 style="color: #38bdf8; margin-top: 0;">🔐 User Login Notification</h2>
              <p style="font-size: 15px; color: #cbd5e1;">A registered client has logged in to the AHH Brothers portal:</p>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 16px 0;" />
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; width: 150px;"><strong>Full Name:</strong></td>
                  <td style="padding: 8px 0; font-weight: bold;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8;"><strong>Email Address:</strong></td>
                  <td style="padding: 8px 0; font-weight: bold; color: #38bdf8;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8;"><strong>Event Type:</strong></td>
                  <td style="padding: 8px 0; font-weight: bold; color: #4ade80;">LOGIN</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8;"><strong>Login Time (PKT):</strong></td>
                  <td style="padding: 8px 0;">${loginTime}</td>
                </tr>
              </table>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 16px 0;" />
              <p style="font-size: 11px; color: #64748b; margin-bottom: 0;">This notification was sent automatically to ${companyEmail}.</p>
            </div>
          `,
        }).catch((emailErr: unknown) => {
          console.error('Failed to send company login notification email:', emailErr)
        })
      } else {
        console.log(`[LOGIN NOTIFICATION LOG] User: ${fullName} (${email}), Time: ${loginTime}`)
      }
    }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred during login.' }
  }

  revalidatePath('/', 'layout')
  redirect(redirectUrl && redirectUrl.startsWith('/') ? redirectUrl : '/')
}

export async function signup(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const fullName = (formData.get('fullName') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const cnic = (formData.get('cnic') as string)?.trim()

  if (!email || !password || !fullName) {
    return { error: 'Email, password, and full name are required.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match. Please verify your password.' }
  }

  let requiresConfirmation = false

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          full_name: fullName,
          phone: phone || '',
          cnic: cnic || '',
        },
      },
    })

    if (error) {
      console.error('Supabase signUp error:', error.message)
      return { error: error.message }
    }

    // Fallback profile upsert in case the DB trigger isn't active.
    // The profiles table now has email & cnic columns (see migration).
    if (data.user) {
      try {
        await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            phone: phone || '',
            cnic: cnic || '',
            role: 'user',
          },
          { onConflict: 'id' }
        )
      } catch (profileErr) {
        console.warn('Profile fallback upsert notice:', profileErr)
      }

      // Send Automated Company Notification Email via Resend
      const resendApiKey = process.env.RESEND_API_KEY
      const companyEmail = process.env.COMPANY_EMAIL || process.env.ADMIN_EMAIL || 'ahhbrothers.developers@gmail.com'
      const registrationTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) + ' (PKT)'
      
      if (resendApiKey && !resendApiKey.includes('your_resend_api_key_here')) {
        try {
          const resend = new Resend(resendApiKey)
          
          await resend.emails.send({
            from: 'AHH Brothers <onboarding@resend.dev>',
            to: [companyEmail],
            subject: `🚨 New User Registration: ${fullName}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 16px; border: 1px solid #334155;">
                <h2 style="color: #f59e0b; margin-top: 0;">🚨 New User Registration Alert</h2>
                <p style="font-size: 15px; color: #cbd5e1;">A new client has created an account on the AHH Brothers portal:</p>
                <hr style="border: 0; border-top: 1px solid #334155; margin: 16px 0;" />
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; width: 150px;"><strong>Full Name:</strong></td>
                    <td style="padding: 8px 0; font-weight: bold;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;"><strong>Email Address:</strong></td>
                    <td style="padding: 8px 0; font-weight: bold; color: #38bdf8;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;"><strong>Phone Number:</strong></td>
                    <td style="padding: 8px 0;">${phone || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;"><strong>CNIC:</strong></td>
                    <td style="padding: 8px 0; font-weight: bold; color: #f59e0b;">${cnic || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;"><strong>Registration Date:</strong></td>
                    <td style="padding: 8px 0;">${registrationTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8;"><strong>User ID:</strong></td>
                    <td style="padding: 8px 0; font-family: monospace; font-size: 12px; color: #a7f3d0;">${data.user.id}</td>
                  </tr>
                </table>
                <hr style="border: 0; border-top: 1px solid #334155; margin: 16px 0;" />
                <p style="font-size: 11px; color: #64748b; margin-bottom: 0;">This notification was sent automatically to ${companyEmail}.</p>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error('Failed to send company registration notification email:', emailErr)
        }
      } else {
        console.log(`[REGISTRATION NOTIFICATION LOG] New User: ${fullName} (${email}), Phone: ${phone}, CNIC: ${cnic}, Time: ${registrationTime}`);
      }
    }

    // If Supabase has email confirmation enabled, session will be null.
    // Disable it at: Supabase Dashboard → Authentication → Providers → Email → Confirm email → OFF
    if (!data.session) {
      requiresConfirmation = true
    }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred during sign up.' }
  }

  const redirectTo = (formData.get('redirect') as string)?.trim()
  const safeRedirect = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/'

  if (requiresConfirmation) {
    // Email confirmation is enabled — user must verify before they can log in.
    return {
      requiresConfirmation: true,
      message: 'Account created! Please check your email to confirm your account, then log in.',
    }
  }

  revalidatePath('/', 'layout')
  redirect(safeRedirect)
}

export async function logout() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await recordUserActivityLog(user, 'logout')
    }
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Sign out error:', err)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
