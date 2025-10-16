'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Row {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  created_at: string
  published_at: string | null
}

export default function AdminPostsList() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, status, created_at, published_at')
      .order('created_at', { ascending: false })
    setRows((data as Row[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const publish = async (id: string) => {
    await supabase.from('posts').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id)
    await load()
  }

  const unpublish = async (id: string) => {
    await supabase.from('posts').update({ status: 'draft' }).eq('id', id)
    await load()
  }

  const remove = async (id: string) => {
    if (!confirm('Excluir este post?')) return
    await supabase.from('posts').delete().eq('id', id)
    await load()
  }

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gold-500">Posts</h2>
        <Link href="/admin/posts/novo" className="px-4 py-2 bg-gold-500 text-gray-900 rounded-md hover:bg-gold-600">Novo Post</Link>
      </div>

      {loading && <div className="text-gray-300">Carregando...</div>}

      <div className="border border-gold-500/20 rounded-md overflow-auto bg-gray-700">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="bg-gray-800 text-gray-100">
              <th className="p-3">Título</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Status</th>
              <th className="p-3">Publicado em</th>
              <th className="p-3 w-80">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-600">
                <td className="p-3">{r.title}</td>
                <td className="p-3">{r.slug}</td>
                <td className="p-3 capitalize">{r.status}</td>
                <td className="p-3">{r.published_at ? new Date(r.published_at).toLocaleString('pt-BR') : '—'}</td>
                <td className="p-3 flex gap-2">
                  <Link href={`/admin/posts/${r.id}`} className="px-3 py-1 rounded-md border border-gray-500 text-gray-200 hover:bg-gray-600">Editar</Link>
                  {r.status === 'draft' ? (
                    <button onClick={() => publish(r.id)} className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700">Publicar</button>
                  ) : (
                    <button onClick={() => unpublish(r.id)} className="px-3 py-1 rounded-md bg-yellow-600 text-white hover:bg-yellow-700">Despublicar</button>
                  )}
                  <button onClick={() => remove(r.id)} className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">Excluir</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">Sem posts</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
