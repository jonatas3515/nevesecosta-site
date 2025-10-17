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

    // List ALL users (sem paginação para garantir que pega todos)
    const { data: usersData, error: usersError } = await (supabase.auth as any).admin.listUsers({ page: 1, perPage: 1000 })
    if (usersError) throw usersError
    
    console.log('[LIST USERS] Total users from auth:', usersData?.users?.length || 0)

    // Load permissions map
    const { data: perms } = await supabase.from('admin_permissions').select('*')
    const permsMap = new Map((perms || []).map((p: any) => [p.user_id, p]))
    console.log('[LIST USERS] Total permissions:', perms?.length || 0)

    // Load profiles with all fields
    const { data: profiles } = await supabase.from('profiles').select('id, role, username, phone, cpf, email, full_name')
    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))
    console.log('[LIST USERS] Total profiles:', profiles?.length || 0)

    const items = (usersData?.users || []).map((u: any) => {
      const profile = profileMap.get(u.id)
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        role: profile?.role || null,
        username: profile?.username || null,
        phone: profile?.phone || null,
        cpf: profile?.cpf || null,
        permissions: permsMap.get(u.id) || null,
        full_name: profile?.full_name || null,
      }
    })
    
    console.log('[LIST USERS] Returning', items.length, 'users')
    console.log('[LIST USERS] Emails:', items.map((i: any) => i.email).join(', '))

    return new Response(JSON.stringify({ items }), { 
      status: 200, 
      headers: { 
        'content-type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      } 
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
