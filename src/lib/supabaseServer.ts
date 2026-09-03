/**
 * Helper para APIs server-side com Supabase
 * Centraliza criação do client admin e respostas JSON
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Cria um client Supabase com service_role key para uso em APIs
 * @throws Error se as variáveis de ambiente não estiverem configuradas
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase not configured')
  }

  return createClient(url, key)
}

/**
 * Cria uma Response JSON padronizada
 */
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Cria uma Response de erro padronizada
 */
export function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message }, status)
}

/**
 * Wrapper para handlers de API que trata erros automaticamente
 */
export async function withSupabaseAdmin<T>(
  handler: (supabase: SupabaseClient) => Promise<T>
): Promise<Response> {
  try {
    const supabase = getSupabaseAdmin()
    const result = await handler(supabase)
    return jsonResponse(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'Supabase not configured') {
      return errorResponse('Supabase not configured', 500)
    }
    console.error('API Error:', error)
    return errorResponse('Internal server error', 500)
  }
}
