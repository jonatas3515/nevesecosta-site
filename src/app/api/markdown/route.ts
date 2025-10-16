import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt({ html: true, linkify: true, typographer: true })

export async function POST(req: Request) {
  try {
    const md = await req.text()
    const html = parser.render(md || '')
    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
  } catch (e: any) {
    return new Response(`<p>Erro ao converter markdown</p>`, { status: 500, headers: { 'content-type': 'text/html; charset=utf-8' } })
  }
}
