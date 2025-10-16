import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(_req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) return new Response('supabase not configured', { status: 500 })

    const supabase = createClient(supabaseUrl, serviceKey)

    const now = new Date().toISOString()
    const { data: expired, error } = await supabase
      .from('orders')
      .select('id, pdf_path')
      .not('pdf_path', 'is', null)
      .lte('pdf_expires_at', now)
      .limit(1000)

    if (error) return new Response(String(error.message || error), { status: 500 })

    let deleted = 0
    if (expired && expired.length) {
      for (const o of expired) {
        if (!o.pdf_path) continue
        const [bucket, ...rest] = String(o.pdf_path).split('/')
        const path = rest.join('/')
        await supabase.storage.from(bucket).remove([path])
        await supabase.from('orders').update({ pdf_path: null, pdf_expires_at: null }).eq('id', o.id)
        deleted++
      }
    }

    return new Response(JSON.stringify({ ok: true, deleted }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 })
  }
}
