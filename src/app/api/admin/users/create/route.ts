import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, role = 'editor', permissions, username, phone, cpf, full_name } = body || {}
    if (!email || !password) return new Response(JSON.stringify({ error: 'email and password required' }), { status: 400 })
    if (String(password).length < 7) return new Response(JSON.stringify({ error: 'password must be at least 7 chars' }), { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })

    const supabase = createClient(url, key)

    // Create auth user
    const { data: created, error: createErr } = await (supabase.auth as any).admin.createUser({ email, password, email_confirm: true })
    if (createErr) throw createErr
    const user = (created as any)?.user
    if (!user) throw new Error('user not created')

    // Upsert profile role
    await supabase.from('profiles').upsert({ id: user.id, role, email, username, phone, cpf, full_name }, { onConflict: 'id' })

    // Upsert permissions
    if (permissions) {
      await supabase.from('admin_permissions').upsert({ user_id: user.id, ...permissions })
    }

    return new Response(JSON.stringify({ id: user.id, email: user.email }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
