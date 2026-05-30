import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, // PASTIKAN PAKAI ANON_KEY
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // PAKAI getUser() UNTUK KEAMANAN (Server Side)
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.pathname

  // --- LOGIKA 1: PROTEKSI HALAMAN ADMIN ---
  if (url.startsWith('/admin')) {
    if (!user) {
      // Gak ada user? Tendang ke login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // --- LOGIKA 2: PROTEKSI ROLE SUPER ADMIN ---
    if (url.startsWith('/admin/data-laporan') || url.startsWith('/admin/kelola-akun')) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id_user', user.id)
        .single()

      if (profile?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  // --- LOGIKA 3: PROTEKSI HALAMAN LOGIN ---
  // Kalau sudah login, jangan kasih masuk ke halaman login lagi
  if (url.startsWith('/login') && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Tangkap semua yang berawalan /admin dan /login
     */
    '/admin/:path*',
    '/login',
  ],
}