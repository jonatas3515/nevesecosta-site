import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id } = body || {}
    
    console.log('[DELETE USER] Received request:', { user_id })
    
    if (!user_id) {
      console.error('[DELETE USER] Missing user_id')
      return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) {
      console.error('[DELETE USER] Supabase not configured')
      return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })
    }

    const supabase = createClient(url, key)

    // Delete from admin_permissions
    console.log('[DELETE USER] Deleting from admin_permissions...')
    const { error: permErr } = await supabase.from('admin_permissions').delete().eq('user_id', user_id)
    if (permErr) console.error('[DELETE USER] Error deleting permissions:', permErr)

    // Delete from profiles
    console.log('[DELETE USER] Deleting from profiles...')
    const { error: profErr } = await supabase.from('profiles').delete().eq('id', user_id)
    if (profErr) console.error('[DELETE USER] Error deleting profile:', profErr)

    // Delete auth user
    console.log('[DELETE USER] Deleting auth user...')
    try {
      const { data, error: delErr } = await supabase.auth.admin.deleteUser(user_id)
      if (delErr) {
        console.error('[DELETE USER] Error deleting auth user:', delErr)
        throw delErr
      }
      console.log('[DELETE USER] Auth user deleted successfully:', data)
    } catch (authErr: any) {
      console.error('[DELETE USER] Exception deleting auth user:', authErr)
      throw new Error(`Falha ao excluir usuário do sistema de autenticação: ${authErr.message}`)
    }

    console.log('[DELETE USER] User deleted successfully')
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    console.error('[DELETE USER] Fatal error:', e)
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
