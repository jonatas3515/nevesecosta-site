import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    console.log('[create-session] Request received')
    const body = await req.json()
    const calc = body?.calc || {}
    console.log('[create-session] Calc data received:', !!calc)

    const secret = process.env.STRIPE_SECRET_KEY
    console.log('[create-session] STRIPE_SECRET_KEY exists:', !!secret)
    console.log('[create-session] STRIPE_SECRET_KEY starts with:', secret?.substring(0, 8))
    if (!secret) {
      console.error('[create-session] Stripe secret key not found in env')
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500, headers: { 'content-type': 'application/json' } })
    }
    const stripe = new Stripe(secret)
    console.log('[create-session] Stripe instance created')

    const origin = req.headers.get('origin') || ''
    const forwardedProto = req.headers.get('x-forwarded-proto') || ''
    const forwardedHost = req.headers.get('x-forwarded-host') || ''
    const host = req.headers.get('host') || ''
    const inferredBase = (forwardedProto && (forwardedHost || host)) ? `${forwardedProto}://${forwardedHost || host}` : ''
    const siteUrl = (process.env.SITE_URL || origin || inferredBase || 'http://localhost:3000').trim()
    console.log('[create-session] SITE_URL:', siteUrl)
    console.log('[create-session] SITE_URL length:', siteUrl.length)
    console.log('[create-session] Creating checkout session...')

    // Try to use stored Stripe price from Supabase products; auto-provision if missing
    let stripePriceId: string | null = null
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const { data: productRow } = await supabase
          .from('products')
          .select('*')
          .eq('name', 'Cálculo em PDF')
          .eq('active', true)
          .maybeSingle()

        if (productRow?.stripe_price_id) {
          stripePriceId = productRow.stripe_price_id
        } else {
          // Ensure Stripe product and price exist
          const product = await stripe.products.create({ name: 'Cálculo em PDF' })
          const price = await stripe.prices.create({ unit_amount: 7500, currency: 'brl', product: product.id })
          stripePriceId = price.id
          // Persist for next runs
          await supabase.from('products').upsert({
            id: productRow?.id,
            name: 'Cálculo em PDF',
            price_cents: 7500,
            active: true,
            stripe_product_id: product.id,
            stripe_price_id: price.id,
            updated_at: new Date().toISOString(),
          })
        }
      }
    } catch (err) {
      console.error('[create-session] Failed ensuring product/price in Supabase/Stripe, proceeding with inline price_data', err)
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: stripePriceId
        ? [ { price: stripePriceId, quantity: 1 } ]
        : [ {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'Download de PDF do Cálculo de Rescisão',
                description: 'Valor simbólico para manter o site no ar. Obrigado pelo apoio!',
              },
              unit_amount: 7500,
            },
            quantity: 1,
          } ],
      payment_method_types: ['card'],
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
        payment_method: 'card',
        calc_data: calc,
      })
      console.log('[create-session] Supabase insert error:', insertError)
    }

    console.log('[create-session] Session created:', session.id)
    console.log('[create-session] Session URL:', session.url)
    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    console.error('[create-session] Error type:', e?.type)
    console.error('[create-session] Error code:', e?.code)
    console.error('[create-session] Error message:', e?.message)
    console.error('[create-session] Full error:', JSON.stringify(e, null, 2))
    const errorMsg = e?.message || String(e)
    return new Response(JSON.stringify({ error: errorMsg }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}

