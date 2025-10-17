import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, role = 'editor', permissions, username, phone, cpf, full_name } = body || {}
    
    console.log('[CREATE USER] Received payload:', { email, role, permissions, username, phone, cpf, full_name })
    
    if (!email || !password) return new Response(JSON.stringify({ error: 'email and password required' }), { status: 400 })
    if (String(password).length < 7) return new Response(JSON.stringify({ error: 'password must be at least 7 chars' }), { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })

    const supabase = createClient(url, key)

    // Create auth user
    const { data: created, error: createErr } = await (supabase.auth as any).admin.createUser({ email, password, email_confirm: true })
    if (createErr) {
      // Better error message for duplicate email
      if (createErr.message?.includes('already been registered') || createErr.message?.includes('already exists')) {
        throw new Error(`O email ${email} já está cadastrado no sistema. Use outro email ou edite o usuário existente.`)
      }
      throw createErr
    }
    const user = (created as any)?.user
    if (!user) throw new Error('user not created')

    // Upsert profile with only provided optional fields (avoid empty strings conflicting with unique indexes)
    const profilePayload: any = { id: user.id, role, email }
    if (username && String(username).trim()) profilePayload.username = String(username).trim()
    if (phone && String(phone).trim()) profilePayload.phone = String(phone).trim()
    if (cpf && String(cpf).trim()) profilePayload.cpf = String(cpf).trim()
    if (full_name && String(full_name).trim()) profilePayload.full_name = String(full_name).trim()
    await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' })

    // Upsert permissions - SEMPRE criar registro, mesmo que vazio
    const permPayload = { 
      user_id: user.id, 
      is_admin: false,
      can_posts: false,
      can_categories: false,
      can_comments: false,
      can_reviews: false,
      can_orders: false,
      can_products: false,
      ...permissions 
    }
    console.log('[CREATE USER] Permissions to save:', permPayload)
    await supabase.from('admin_permissions').upsert(permPayload, { onConflict: 'user_id' })

    return new Response(JSON.stringify({ id: user.id, email: user.email }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}

