import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })

    const supabase = createClient(url, key)

    // List first 100 users
    const { data: usersData, error: usersError } = await (supabase.auth as any).admin.listUsers({ page: 1, perPage: 100 })
    if (usersError) throw usersError

    // Load permissions map
    const { data: perms } = await supabase.from('admin_permissions').select('*')
    const permsMap = new Map((perms || []).map((p: any) => [p.user_id, p]))

    // Load profiles roles
    const { data: profiles } = await supabase.from('profiles').select('id, role')
    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p.role]))

    const items = (usersData?.users || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      role: profileMap.get(u.id) || null,
      permissions: permsMap.get(u.id) || null,
    }))

    return new Response(JSON.stringify({ items }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
