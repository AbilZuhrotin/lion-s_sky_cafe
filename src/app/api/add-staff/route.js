import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email, password, username, role } = await request.json()

  // Pakai Service Role Key biar bisa bypass proteksi
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // KUNCI MASTER
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 1. Bikin Akun di Auth (Gedung 1)
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Langsung aktif gak perlu verif email
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  // 2. Bikin Profil di Tabel Users (Gedung 2)
  const { error: dbError } = await supabaseAdmin
    .from('users')
    .insert([{ id_user: authUser.user.id, email, username, role }])

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 400 })

  return NextResponse.json({ message: 'Staff Berhasil Dibuat!' })
}