import { getSupabaseAdmin, jsonResponse, errorResponse } from '@/lib/supabaseServer'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')

    if (!token) {
      return errorResponse('Não autenticado', 401)
    }

    const admin = getSupabaseAdmin()
    const { data: { user }, error: authError } = await admin.auth.getUser(token)

    if (authError || !user) {
      return errorResponse('Não autenticado', 401)
    }

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return errorResponse('Não autorizado', 403)
    }

    const { data: leads, error } = await admin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar leads:', error)
      return errorResponse('Erro ao buscar contatos')
    }

    return jsonResponse({
      success: true,
      leads: leads || [],
      total: leads?.length || 0
    })
  } catch (error) {
    console.error('Erro no servidor:', error)
    return errorResponse('Erro interno do servidor')
  }
}
