import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, email, password, role, permissions, username, phone, cpf } = body || {}
    if (!user_id) return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })

    const supabase = createClient(url, key)

    // Update auth
    if (email || password) {
      const { error: updErr } = await (supabase.auth as any).admin.updateUserById(user_id, { email, password })
      if (updErr) throw updErr
    }

    // Update profile role and identity fields
    const profileUpdate: any = { id: user_id }
    if (role) profileUpdate.role = role
    if (email) profileUpdate.email = email
    if (username) profileUpdate.username = username
    if (phone) profileUpdate.phone = phone
    if (cpf) profileUpdate.cpf = cpf
    if (Object.keys(profileUpdate).length > 1) {
      await supabase.from('profiles').upsert(profileUpdate, { onConflict: 'id' })
    }

    // Update permissions
    if (permissions) {
      await supabase.from('admin_permissions').upsert({ user_id, ...permissions })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
