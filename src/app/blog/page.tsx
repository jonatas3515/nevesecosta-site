'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'
import type { Metadata } from 'next'
import Canonical from '@/components/seo/Canonical'
import JsonLd from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Blog Jurídico • Artigos e Orientações',
  description: 'Conteúdo jurídico produzido pela Neves & Costa Advocacia e Consultoria. Notícias, artigos e orientações práticas.',
  alternates: { canonical: '/blog' },
}

interface UIPostCard {
  id: string
  title: string
  slug: string
  image: string
  date: string
  readTime: string
  category: string
  excerpt: string
  author: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<UIPostCard[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Busca posts publicados e junta categorias (nomes) via RPC simples
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(
          `id, title, subtitle, slug, cover_url, content_html, status, published_at, created_at`
        )
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (error) {
        console.error('Erro carregando posts:', error)
        setLoading(false)
        return
      }

      // Buscar categorias por post
      const { data: pc, error: pcErr } = await supabase
        .from('post_categories')
        .select('post_id, category:categories(name)')

      if (pcErr) {
        console.error('Erro carregando categorias:', pcErr)
      }

      const catMap = new Map<string, string[]>()
      pc?.forEach((row: any) => {
        if (!row.post_id || !row.category?.name) return
        const arr = catMap.get(row.post_id) || []
        arr.push(row.category.name)
        catMap.set(row.post_id, arr)
      })

      const normalized: UIPostCard[] = (postsData || []).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        image: p.cover_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
        date: p.published_at || p.created_at,
        readTime: '5 min',
        category: (catMap.get(p.id)?.[0]) || 'Geral',
        excerpt: p.subtitle || '',
        author: (p as any).author_name || 'Equipe Neves & Costa',
      }))

      setPosts(normalized)
      setLoading(false)
    }
    fetchData()
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.category && set.add(p.category))
    return Array.from(set)
  }, [posts])

  const visiblePosts = useMemo(() => {
    if (!activeCategory) return posts
    return posts.filter((p) => p.category === activeCategory)
  }, [posts, activeCategory])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Canonical + BreadcrumbList */}
      <Canonical />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://www.nevesecosta.com.br/blog' },
          ],
        }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Blog Jurídico
            </h1>
            <p className="text-xl text-gray-200">
              Artigos, notícias e orientações sobre diversos temas do direito
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                !activeCategory ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(loading ? [] : visiblePosts).map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gold-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{formatDate(new Date(post.date || new Date()))}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{post.readTime || '5 min'}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary-600 font-semibold hover:text-primary-700 flex items-center space-x-1"
                      >
                        <span>Ler mais</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
              {(!loading && visiblePosts.length === 0) && (
                <div className="col-span-full text-center text-gray-500">Sem posts para esta categoria.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
