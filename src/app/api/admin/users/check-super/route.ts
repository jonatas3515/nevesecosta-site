import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUPER_ADMIN_EMAIL = 'jonatascosta.adv@gmail.com'

export async function GET(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })

    const supabase = createClient(url, key)
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return new Response(JSON.stringify({ is_super: false }), { status: 200, headers: { 'content-type': 'application/json' } })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return new Response(JSON.stringify({ is_super: false }), { status: 200, headers: { 'content-type': 'application/json' } })

    const is_super = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
    return new Response(JSON.stringify({ is_super, email: user.email }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
