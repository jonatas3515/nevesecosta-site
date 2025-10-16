import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id') || ''
    const id = req.nextUrl.searchParams.get('id') || ''

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) return new Response('supabase not configured', { status: 500 })

    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: order, error } = await supabase
      .from('orders')
      .select('id, pdf_path, pdf_expires_at')
      .eq(id ? 'id' : 'session_id', id || sessionId)
      .single()
    if (error || !order) return new Response('order not found', { status: 404 })

    if (!order.pdf_path) return new Response('pdf not generated', { status: 404 })
    if (!order.pdf_expires_at || new Date(order.pdf_expires_at) <= new Date()) return new Response('pdf expired', { status: 410 })

    const [bucket, ...rest] = String(order.pdf_path).split('/')
    const path = rest.join('/')

    // Gera URL assinada limitada a 7 dias (ou até expiração do arquivo, o que ocorrer primeiro)
    const maxMs = 7 * 24 * 60 * 60 * 1000
    const remainingMs = new Date(order.pdf_expires_at).getTime() - Date.now()
    const expiresIn = Math.max(60, Math.min(Math.floor(remainingMs / 1000), Math.floor(maxMs / 1000)))

    const { data: signed, error: urlErr } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
    if (urlErr || !signed?.signedUrl) return new Response(String(urlErr?.message || 'cannot sign'), { status: 500 })

    return new Response(JSON.stringify({ url: signed.signedUrl, expires_in: expiresIn }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 })
  }
}
