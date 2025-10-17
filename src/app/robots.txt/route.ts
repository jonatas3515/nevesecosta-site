import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://www.nevesecosta.com.br/sitemap.xml
`
  return new NextResponse(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
