'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import JsonLd from '@/components/seo/JsonLd'
import Canonical from '@/components/seo/Canonical'

interface BlogPost {
  id: string
  title: string
  subtitle?: string
  slug: string
  cover_url?: string
  content_html?: string
  published_at?: string
  created_at: string
  read_time?: string
  category?: string
  author?: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      try {
        const { data: postsData, error } = await supabase
          .from('posts')
          .select(`
            id, 
            title, 
            subtitle, 
            slug, 
            cover_url, 
            content_html, 
            published_at, 
            created_at, 
            author_name,
            post_categories(
              category:categories(id, name)
            )
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })

        if (error) {
          console.error('Erro ao carregar posts:', error)
          setPosts([])
          setLoading(false)
          return
        }

        const formattedPosts = (postsData || []).map((post: any) => {
          const category = post.post_categories && post.post_categories.length > 0 
            ? post.post_categories[0].category?.name || 'Geral' 
            : 'Geral'
          
          return {
            id: post.id,
            title: post.title,
            subtitle: post.subtitle,
            slug: post.slug,
            cover_url: post.cover_url,
            content_html: post.content_html,
            published_at: post.published_at,
            created_at: post.created_at,
            read_time: '5 min',
            category,
            author: post.author_name || 'Equipe Neves & Costa',
          }
        })

        setPosts(formattedPosts)
      } catch (error) {
        console.error('Erro ao carregar posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  // Get unique categories for filter
  const categories = ['todos', ...Array.from(new Set(posts.map(post => post.category).filter(Boolean)))]

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.subtitle && post.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'todos' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Canonical />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Blog Jurídico • Neves & Costa Advocacia',
          description: 'Conteúdo jurídico produzido pela Neves & Costa Advocacia e Consultoria. Notícias, artigos e orientações práticas.',
          url: 'https://www.nevesecosta.com.br/blog',
          publisher: {
            '@type': 'Organization',
            name: 'Neves & Costa Advocacia e Consultoria',
            logo: {
              '@type': 'ImageObject',
              url: 'https://i.im.ge/2025/10/18/nRo1MP.Logo-transparente.png',
            },
          },
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog Jurídico</h1>
              <p className="text-xl text-gray-200 mb-8">
                Artigos, notícias e orientações jurídicas produzidas por nossa equipe de especialistas
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'todos' ? 'Todas as categorias' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {searchTerm || selectedCategory !== 'todos' ? 'Nenhum post encontrado' : 'Nenhum post publicado ainda'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'todos' 
                    ? 'Tente ajustar seus filtros de busca ou categoria.'
                    : 'Em breve publicaremos novos conteúdos jurídicos para você.'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'todos') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('todos')
                    }}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      {/* Cover Image */}
                      <div className="relative h-48">
                        <Image
                          src={post.cover_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800'}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          unoptimized
                        />
                        {post.category && (
                          <span className="absolute top-4 left-4 bg-gold-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                            {post.category}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <Link href={`/blog/${post.slug}`} className="block group">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {post.title}
                          </h3>
                          {post.subtitle && (
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {post.subtitle}
                            </p>
                          )}
                        </Link>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-2">
                            <User size={16} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>{post.read_time}</span>
                          </div>
                        </div>

                        {/* Date and Link */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar size={16} />
                            <span>{formatDate(new Date(post.published_at || post.created_at))}</span>
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            <span>Ler mais</span>
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Precisa de orientação jurídica?</h2>
              <p className="text-xl text-gray-200 mb-8">
                Nossa equipe está pronta para ajudar com suas necessidades jurídicas.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/areas"
                  className="px-8 py-4 rounded-lg bg-gold-500 text-gray-900 hover:bg-gold-600 font-semibold transition-colors"
                >
                  Conheça nossas áreas
                </Link>
                <Link
                  href="/contato"
                  className="px-8 py-4 rounded-lg bg-white text-primary-900 hover:bg-gray-100 font-semibold transition-colors"
                >
                  Fale conosco
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}