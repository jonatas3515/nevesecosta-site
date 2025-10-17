import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const base = new URL('https://www.nevesecosta.com.br')
  const slug = params.slug

  // Defaults in case of failure
  let title = 'Artigo do Blog'
  let description = 'Conteúdo jurídico da Neves & Costa Advocacia e Consultoria.'
  let image = 'https://i.im.ge/2025/10/18/nRo1MP.Logo-transparente.png'

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (url && key) {
      const supabase = createClient(url, key)
      const { data: p } = await supabase
        .from('posts')
        .select('title, subtitle, cover_url, slug, published_at, created_at')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (p) {
        title = p.title || title
        description = p.subtitle || description
        image = p.cover_url || image
      }
    }
  } catch {}

  const urlAbs = new URL(`/blog/${slug}`, base).toString()

  return {
    title: `${title}`,
    description,
    alternates: { canonical: urlAbs },
    openGraph: {
      type: 'article',
      url: urlAbs,
      title,
      description,
      images: [{ url: image }],
      siteName: 'Neves & Costa',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children
}
