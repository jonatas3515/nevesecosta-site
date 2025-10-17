import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, email, password, role, permissions, username, phone, cpf, full_name } = body || {}
    if (!user_id) return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })

    const supabase = createClient(url, key)

    // Update auth (apenas se email ou password foram fornecidos)
    const authUpdate: any = {}
    if (email) authUpdate.email = email
    if (password) authUpdate.password = password
    
    if (Object.keys(authUpdate).length > 0) {
      console.log('[UPDATE] Updating auth with:', authUpdate)
      const { error: updErr } = await supabase.auth.admin.updateUserById(user_id, authUpdate)
      if (updErr) {
        console.error('[UPDATE] Auth update error:', updErr)
        throw new Error(`Erro ao atualizar autenticação: ${updErr.message}`)
      }
      console.log('[UPDATE] Auth updated successfully')
    }

    // Update profile role and identity fields (sanitize optional fields to avoid empty string conflicts)
    const profileUpdate: any = { id: user_id }
    if (role) profileUpdate.role = role
    if (email) profileUpdate.email = email
    if (username !== undefined) profileUpdate.username = String(username).trim() || null
    if (phone !== undefined) profileUpdate.phone = String(phone).trim() || null
    if (cpf !== undefined) profileUpdate.cpf = String(cpf).trim() || null
    if (full_name !== undefined) profileUpdate.full_name = String(full_name).trim() || null
    
    console.log('[UPDATE] Profile update payload:', profileUpdate)
    
    if (Object.keys(profileUpdate).length > 1) {
      const { error: profileError, data: profileData } = await supabase.from('profiles').upsert(profileUpdate, { onConflict: 'id' })
      if (profileError) {
        console.error('[UPDATE] Profile update error:', profileError)
        throw new Error(`Erro ao atualizar perfil: ${profileError.message}`)
      }
      console.log('[UPDATE] Profile updated successfully:', profileData)
    }

    // Update permissions
    if (permissions) {
      console.log('[UPDATE] Permissions payload:', { user_id, ...permissions })
      const { error: permError, data: permData } = await supabase.from('admin_permissions').upsert({ user_id, ...permissions }, { onConflict: 'user_id' })
      if (permError) {
        console.error('[UPDATE] Permissions update error:', permError)
        throw new Error(`Erro ao atualizar permissões: ${permError.message}`)
      }
      console.log('[UPDATE] Permissions updated successfully:', permData)
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
