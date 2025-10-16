import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      name,
      price_cents,
      promo_price_cents,
      image_url,
      active = true,
    } = body || {}

    if (!name || !price_cents) {
      return new Response(JSON.stringify({ error: 'name and price_cents are required' }), { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!supabaseUrl || !serviceKey) return new Response(JSON.stringify({ error: 'supabase not configured' }), { status: 500 })
    const supabase = createClient(supabaseUrl, serviceKey)

    // Ensure Stripe
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) return new Response(JSON.stringify({ error: 'stripe not configured' }), { status: 500 })
    const stripe = new Stripe(stripeSecret)

    // Fetch existing row if id given
    let stripe_product_id: string | null = null
    let stripe_price_id: string | null = null
    if (id) {
      const { data: existing } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
      if (existing) {
        stripe_product_id = existing.stripe_product_id
        stripe_price_id = existing.stripe_price_id
      }
    }

    // Create product/price on Stripe if missing
    if (!stripe_product_id) {
      const product = await stripe.products.create({ name, images: image_url ? [image_url] : undefined })
      stripe_product_id = product.id
    }
    if (!stripe_price_id) {
      const price = await stripe.prices.create({ unit_amount: price_cents, currency: 'brl', product: stripe_product_id! })
      stripe_price_id = price.id
    }

    const upsertPayload = {
      id,
      name,
      price_cents,
      promo_price_cents: promo_price_cents ?? null,
      image_url: image_url ?? null,
      active,
      stripe_product_id,
      stripe_price_id,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('products').upsert(upsertPayload, { onConflict: 'id' }).select('*').single()
    if (error) throw error

    return new Response(JSON.stringify({ item: data }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
