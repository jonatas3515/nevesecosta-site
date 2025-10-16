import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, rating, comment, comment_date } = body || {}
    if (!name || !rating || !comment || !comment_date) {
      return new Response(JSON.stringify({ error: 'name, rating, comment, comment_date are required' }), { status: 400 })
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })
    const supabase = createClient(url, key)
    const payload = { id, name, rating, comment, comment_date }
    const { data, error } = await supabase.from('reviews').upsert(payload, { onConflict: 'id' }).select('*').single()
    if (error) throw error
    return new Response(JSON.stringify({ item: data }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
