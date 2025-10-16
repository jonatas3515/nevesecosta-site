import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { id, session_id, to } = await req.json()

    const apiKey = process.env.RESEND_API_KEY as string
    const from = process.env.RESEND_FROM as string
    if (!apiKey || !from) return new Response('email not configured', { status: 500 })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) return new Response('supabase not configured', { status: 500 })

    const supabase = createClient(supabaseUrl, serviceKey)

    // Get order
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, session_id, email, pdf_path, pdf_expires_at')
      .eq(id ? 'id' : 'session_id', id || session_id)
      .single()
    if (error || !order) return new Response('order not found', { status: 404 })

    if (!order.pdf_path) return new Response('pdf not generated', { status: 400 })
    if (!order.pdf_expires_at || new Date(order.pdf_expires_at) <= new Date()) return new Response('pdf expired', { status: 410 })

    // Create signed URL
    const [bucket, ...rest] = String(order.pdf_path).split('/')
    const path = rest.join('/')

    const remainingMs = new Date(order.pdf_expires_at).getTime() - Date.now()
    const expiresIn = Math.max(60, Math.min(Math.floor(remainingMs / 1000), 7 * 24 * 60 * 60))

    const { data: signed, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
    if (signErr || !signed?.signedUrl) return new Response(String(signErr?.message || 'cannot sign'), { status: 500 })

    const resend = new Resend(apiKey)
    const recipient = String(to || order.email || '').trim()
    if (!recipient) return new Response('recipient email missing', { status: 400 })

    const subject = 'Seu PDF do Cálculo de Rescisão'
    const html = `
      <p>Olá,</p>
      <p>Segue o link para baixar o seu PDF. O link é válido até a data de expiração do documento.</p>
      <p><a href="${signed.signedUrl}">Baixar PDF</a></p>
      <p>Atenciosamente,<br/>Neves & Costa Advocacia</p>
    `

    await resend.emails.send({ from, to: recipient, subject, html })

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 })
  }
}
