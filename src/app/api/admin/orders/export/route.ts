import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(_req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) return new Response('supabase not configured', { status: 500 })

    const supabase = createClient(supabaseUrl, serviceKey)
    const { data, error } = await supabase
      .from('orders')
      .select('id, session_id, email, status, amount, payment_method, created_at, paid_at')
      .order('created_at', { ascending: false })
    if (error) return new Response(String(error.message || error), { status: 500 })

    const rows = [
      ['id','session_id','email','status','amount_cents','payment_method','created_at','paid_at'],
      ...((data||[]).map(r => [r.id, r.session_id, r.email || '', r.status, String(r.amount), r.payment_method || '', r.created_at, r.paid_at || '']))
    ]
    const csv = rows.map(cols => cols.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')

    return new Response(csv, {
      status: 200,
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="orders_export_${Date.now()}.csv"`
      }
    })
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 })
  }
}
