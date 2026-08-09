import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isEmailAdmin } from '@/lib/constants'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and supabase.auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const isAdminRoute = pathname.startsWith('/admin')
  const isMyPlotsRoute = pathname.startsWith('/my-plots')
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')

  // 1. Protection for /admin/* routes: requires 'admin' or 'accounts' role
  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'Please sign in to access the admin panel.')
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Query profile for role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const userRole = profile?.role
    const isAuthorized = userRole === 'admin' || userRole === 'accounts' || isEmailAdmin(user.email)

    if (!isAuthorized) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('error', 'Access Denied — Insufficient permissions to access admin panel.')
      return NextResponse.redirect(url)
    }
  }

  // 2. Protection for /my-plots route: requires any authenticated user
  if (isMyPlotsRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'Please log in or register to view your booked plots.')
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  // 3. If authenticated user tries to access /login or /signup, redirect to home
  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect')
    const url = request.nextUrl.clone()
    url.pathname = redirectUrl && redirectUrl.startsWith('/') ? redirectUrl : '/'
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
