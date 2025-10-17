import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.nevesecosta.com.br'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/sobre`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/equipe`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/areas`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/calculadora`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contato`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/avaliacoes`, changeFrequency: 'weekly', priority: 0.5 },
  ]

  // Tentar carregar posts/categorias do Supabase
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (url && key) {
      const supabase = createClient(url, key)
      const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at, published_at, status')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1000)

      const postRoutes: MetadataRoute.Sitemap = (posts || [])
        .filter((p: any) => !!p.slug)
        .map((p: any) => ({
          url: `${base}/blog/${p.slug}`,
          lastModified: p.updated_at || p.published_at || new Date().toISOString(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }))

      return [...staticRoutes, ...postRoutes]
    }
  } catch {
    // ignore
  }

  return staticRoutes
}
