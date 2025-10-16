import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  console.log('========== VERIFY ENDPOINT CALLED ==========')
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id') || ''
    console.log('[verify] session_id:', sessionId)
    if (!sessionId) return new Response(JSON.stringify({ error: 'missing session_id' }), { status: 400 })
    
    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) return new Response(JSON.stringify({ error: 'stripe not configured' }), { status: 500 })

    const stripe = new Stripe(secret)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log('[verify] Stripe session payment_status:', session.payment_status)
    
    // Atualizar order no Supabase usando SERVICE_ROLE_KEY para bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    console.log('[verify] supabaseUrl:', !!supabaseUrl)
    console.log('[verify] supabaseServiceKey:', !!supabaseServiceKey)
    
    if (supabaseUrl && supabaseServiceKey && session.payment_status === 'paid') {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('session_id', sessionId)
      console.log('[verify] Supabase update error:', updateError)
    }
    
    // Consider paid when payment_status is 'paid'
    if (session.payment_status === 'paid') {
      // Buscar calc_data do Supabase
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        console.log('[verify] Fetching order from Supabase...')
        const { data: order, error: fetchError } = await supabase
          .from('orders')
          .select('calc_data')
          .eq('session_id', sessionId)
          .single()
        console.log('[verify] Supabase fetch error:', fetchError)
        console.log('[verify] Supabase order:', !!order)
        console.log('[verify] Supabase calc_data:', !!order?.calc_data)
        return new Response(JSON.stringify({ paid: true, calc: order?.calc_data }), { status: 200, headers: { 'content-type': 'application/json' } })
      }
      return new Response(JSON.stringify({ paid: true }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({ paid: false }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    console.error('[verify] Error:', e)
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
