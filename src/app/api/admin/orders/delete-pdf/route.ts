import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 })
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })
    const supabase = createClient(url, key)

    const { data: order, error: fetchErr } = await supabase.from('orders').select('id,pdf_path').eq('id', id).single()
    if (fetchErr || !order) return new Response(JSON.stringify({ error: 'order not found' }), { status: 404 })

    if (order.pdf_path) {
      const [bucket, ...rest] = String(order.pdf_path).split('/')
      const path = rest.join('/')
      await supabase.storage.from(bucket).remove([path])
    }

    await supabase.from('orders').update({ pdf_path: null, pdf_expires_at: null }).eq('id', id)
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
