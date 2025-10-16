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
       <div className="grid md:grid-cols-4 gap-4 mb-6">
         <div className="p-4 border rounded-lg">
           <div className="text-sm text-gray-500">Posts</div>
           <div className="text-2xl font-bold">{loading ? '—' : counts.posts}</div>
           <div className="text-xs text-gray-500">{loading ? '' : `${counts.published} publicados • ${counts.drafts} rascunhos`}</div>
         </div>
         <div className="p-4 border rounded-lg">
           <div className="text-sm text-gray-500">Categorias</div>
           <div className="text-2xl font-bold">{loading ? '—' : counts.categories}</div>
         </div>
         <div className="p-4 border rounded-lg">
           <div className="text-sm text-gray-500">Comentários Pendentes</div>
           <div className="text-2xl font-bold">{loading ? '—' : counts.pendingComments}</div>
         </div>
       </div>
       <div className="flex gap-3">
         <Link href="/admin/posts/novo" className="px-4 py-2 bg-primary-600 text-white rounded-md">Novo Post</Link>
         <Link href="/admin/posts" className="px-4 py-2 border rounded-md">Gerenciar Posts</Link>
         <Link href="/admin/categorias" className="px-4 py-2 border rounded-md">Gerenciar Categorias</Link>
         <Link href="/admin/comentarios" className="px-4 py-2 border rounded-md">Moderar Comentários</Link>
       </div>
     </div>
   )
 }
