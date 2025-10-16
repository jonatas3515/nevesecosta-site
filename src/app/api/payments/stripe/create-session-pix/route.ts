import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    console.log('[create-session-pix] Request received')
    const body = await req.json()
    const calc = body?.calc || {}
    console.log('[create-session-pix] Calc data received:', !!calc)

    const secret = process.env.STRIPE_SECRET_KEY
    console.log('[create-session-pix] STRIPE_SECRET_KEY exists:', !!secret)
    console.log('[create-session-pix] STRIPE_SECRET_KEY starts with:', secret?.substring(0, 8))
    if (!secret) {
      console.error('[create-session-pix] Stripe secret key not found in env')
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500, headers: { 'content-type': 'application/json' } })
    }
    const stripe = new Stripe(secret)
    console.log('[create-session-pix] Stripe instance created')

    const origin = req.headers.get('origin') || ''
    const forwardedProto = req.headers.get('x-forwarded-proto') || ''
    const forwardedHost = req.headers.get('x-forwarded-host') || ''
    const host = req.headers.get('host') || ''
    const inferredBase = (forwardedProto && (forwardedHost || host)) ? `${forwardedProto}://${forwardedHost || host}` : ''
    const siteUrl = (process.env.SITE_URL || origin || inferredBase || 'http://localhost:3000').trim()
    console.log('[create-session-pix] SITE_URL:', siteUrl)
    console.log('[create-session-pix] SITE_URL length:', siteUrl.length)
    console.log('[create-session-pix] Creating checkout session with Pix...')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Download de PDF do Cálculo de Rescisão',
              description: 'Valor simbólico para manter o site no ar. Obrigado pelo apoio!',
            },
            unit_amount: 7500, // R$ 75,00 em centavos
          },
          quantity: 1,
        },
      ],
      payment_method_types: ['pix'],
      success_url: `${siteUrl}/calculadora?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/calculadora?canceled=1`,
      metadata: {
        calc_payload: JSON.stringify(calc).slice(0, 4500),
      },
    })

    // Salvar order no Supabase usando SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const { error: insertError } = await supabase.from('orders').insert({
        session_id: session.id,
        status: 'pending',
        amount: 7500,
        payment_method: 'pix',
        calc_data: calc,
      })
      console.log('[create-session-pix] Supabase insert error:', insertError)
    }

    console.log('[create-session-pix] Session created:', session.id)
    console.log('[create-session-pix] Session URL:', session.url)
    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    console.error('[create-session-pix] Error type:', e?.type)
    console.error('[create-session-pix] Error code:', e?.code)
    console.error('[create-session-pix] Error message:', e?.message)
    console.error('[create-session-pix] Full error:', JSON.stringify(e, null, 2))
    const errorMsg = e?.message || String(e)
    return new Response(JSON.stringify({ error: errorMsg }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}

