'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ui/toast'

interface Row {
  id: string
  post_id: string
  author_name: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminComentarios() {
  const { show } = useToast()
  const [rows, setRows] = useState<Row[]>([])
  const [replying, setReplying] = useState<{ [id: string]: string }>({})
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('id, post_id, author_name, content, status, created_at')
      .order('created_at', { ascending: false })
    setRows(data as Row[] || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const setStatus = async (id: string, status: Row['status']) => {
    const { error } = await supabase.from('comments').update({ status }).eq('id', id)
    if (error) {
      show({ title: 'Erro ao atualizar', description: error.message, variant: 'error' })
    } else {
      show({ title: status === 'approved' ? 'Comentário aprovado' : 'Comentário rejeitado', variant: 'success' })
      await load()
    }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (error) {
      show({ title: 'Erro ao excluir', description: error.message, variant: 'error' })
    } else {
      show({ title: 'Comentário excluído', variant: 'success' })
      await load()
    }
  }

  const reply = async (row: Row) => {
    const { data: userData } = await supabase.auth.getUser()
    const content = replying[row.id]
    if (!content) return
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: row.post_id,
        parent_id: row.id,
        author_name: 'Equipe Neves & Costa',
        content,
        status: 'approved',
        is_staff_reply: true,
        replied_by: userData.user?.id || null,
      })
    if (error) {
      show({ title: 'Erro ao responder', description: error.message, variant: 'error' })
    } else {
      setReplying((prev) => ({ ...prev, [row.id]: '' }))
      show({ title: 'Resposta enviada', variant: 'success' })
      await load()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comentários</h2>
      {loading && <div>Carregando...</div>}
      <div className="border rounded-md">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3">Autor</th>
              <th className="p-3">Comentário</th>
              <th className="p-3">Status</th>
              <th className="p-3 w-64">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.author_name || 'Visitante'}</td>
                <td className="p-3">{r.content}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 space-y-2">
                  <div className="flex gap-2">
                    <button onClick={() => setStatus(r.id, 'approved')} className="px-3 py-1 rounded-md bg-green-600 text-white">Aprovar</button>
                    <button onClick={() => setStatus(r.id, 'rejected')} className="px-3 py-1 rounded-md bg-yellow-600 text-white">Rejeitar</button>
                    <button onClick={() => remove(r.id)} className="px-3 py-1 rounded-md bg-red-600 text-white">Excluir</button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={replying[r.id] || ''}
                      onChange={(e) => setReplying((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      placeholder="Responder como equipe..."
                      className="border rounded-md px-2 py-1 flex-1"
                    />
                    <button onClick={() => reply(r)} className="px-3 py-1 rounded-md bg-primary-600 text-white">Responder</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Sem comentários</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
