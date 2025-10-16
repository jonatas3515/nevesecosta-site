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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Link href="/admin/posts/novo" className="px-4 py-2 bg-primary-600 text-white rounded-md">Novo Post</Link>
      </div>

      {loading && <div>Carregando...</div>}

      <div className="border rounded-md overflow-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3">Título</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Status</th>
              <th className="p-3">Publicado em</th>
              <th className="p-3 w-80">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.title}</td>
                <td className="p-3">{r.slug}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">{r.published_at ? new Date(r.published_at).toLocaleString() : '—'}</td>
                <td className="p-3 flex gap-2">
                  <Link href={`/admin/posts/${r.id}`} className="px-3 py-1 rounded-md border">Editar</Link>
                  {r.status === 'draft' ? (
                    <button onClick={() => publish(r.id)} className="px-3 py-1 rounded-md bg-green-600 text-white">Publicar</button>
                  ) : (
                    <button onClick={() => unpublish(r.id)} className="px-3 py-1 rounded-md bg-yellow-600 text-white">Despublicar</button>
                  )}
                  <button onClick={() => remove(r.id)} className="px-3 py-1 rounded-md bg-red-600 text-white">Excluir</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">Sem posts</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
