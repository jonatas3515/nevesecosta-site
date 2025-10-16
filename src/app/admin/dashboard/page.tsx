 'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({
    posts: 0,
    drafts: 0,
    published: 0,
    categories: 0,
    pendingComments: 0,
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [allPosts, drafts, published, cats, pending] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])
      setCounts({
        posts: allPosts.count || 0,
        drafts: drafts.count || 0,
        published: published.count || 0,
        categories: cats.count || 0,
        pendingComments: pending.count || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gold-500 mb-6">Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-6 border border-gold-500/30 rounded-lg bg-gray-700">
          <div className="text-sm text-gray-400">Posts</div>
          <div className="text-3xl font-bold text-gold-500">{loading ? '—' : counts.posts}</div>
          <div className="text-xs text-gray-400 mt-1">{loading ? '' : `${counts.published} publicados • ${counts.drafts} rascunhos`}</div>
        </div>
        <div className="p-6 border border-gold-500/30 rounded-lg bg-gray-700">
          <div className="text-sm text-gray-400">Categorias</div>
          <div className="text-3xl font-bold text-gold-500">{loading ? '—' : counts.categories}</div>
        </div>
        <div className="p-6 border border-gold-500/30 rounded-lg bg-gray-700">
          <div className="text-sm text-gray-400">Comentários Pendentes</div>
          <div className="text-3xl font-bold text-gold-500">{loading ? '—' : counts.pendingComments}</div>
        </div>
      </div>
      {/* Removidos botões duplicados para evitar repetição: navegação permanece na barra superior */}
    </div>
  )
}
