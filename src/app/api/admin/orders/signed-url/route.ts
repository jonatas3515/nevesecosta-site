import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id') || ''
    const id = req.nextUrl.searchParams.get('id') || ''

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500, headers: { 'content-type': 'application/json' } })

    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: order, error } = await supabase
      .from('orders')
      .select('id, pdf_path, pdf_expires_at')
      .eq(id ? 'id' : 'session_id', id || sessionId)
      .single()
    if (error || !order) return new Response(JSON.stringify({ error: 'order not found' }), { status: 404, headers: { 'content-type': 'application/json' } })

    if (!order.pdf_path) return new Response(JSON.stringify({ error: 'pdf not generated' }), { status: 404, headers: { 'content-type': 'application/json' } })
    if (!order.pdf_expires_at || new Date(order.pdf_expires_at) <= new Date()) return new Response(JSON.stringify({ error: 'pdf expired' }), { status: 410, headers: { 'content-type': 'application/json' } })

    const [bucket, ...rest] = String(order.pdf_path).split('/')
    const path = rest.join('/')

    // Gera URL assinada limitada a 7 dias (ou até expiração do arquivo, o que ocorrer primeiro)
    const maxMs = 7 * 24 * 60 * 60 * 1000
    const remainingMs = new Date(order.pdf_expires_at).getTime() - Date.now()
    const expiresIn = Math.max(60, Math.min(Math.floor(remainingMs / 1000), Math.floor(maxMs / 1000)))

    const { data: signed, error: urlErr } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
    if (urlErr || !signed?.signedUrl) return new Response(JSON.stringify({ error: urlErr?.message || 'cannot sign' }), { status: 500, headers: { 'content-type': 'application/json' } })

    return new Response(JSON.stringify({ url: signed.signedUrl, expires_in: expiresIn }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
