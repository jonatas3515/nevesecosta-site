import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const siteUrl = process.env.SITE_URL
  const siteUrlTrimmed = siteUrl?.trim()
  
  return new Response(JSON.stringify({
    hasSecret: !!secret,
    secretPrefix: secret?.substring(0, 12),
    hasPublishable: !!publishable,
    publishablePrefix: publishable?.substring(0, 12),
    siteUrl: siteUrl,
    siteUrlTrimmed: siteUrlTrimmed,
    siteUrlLength: siteUrl?.length,
    siteUrlTrimmedLength: siteUrlTrimmed?.length,
    env: process.env.NODE_ENV,
  }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}
