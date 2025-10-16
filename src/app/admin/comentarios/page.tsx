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
  is_staff_reply?: boolean
}

export default function AdminComentarios() {
  const { show } = useToast()
  const [rows, setRows] = useState<Row[]>([])
  const [replying, setReplying] = useState<{ [id: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string>('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('id, post_id, author_name, content, status, created_at, is_staff_reply')
      .order('created_at', { ascending: false })
    setRows(data as Row[] || [])
    setLoading(false)
  }

  const startEdit = (row: Row) => {
    setEditingId(row.id)
    setEditContent(row.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const saveEdit = async (row: Row) => {
    if (!editContent.trim()) return
    const { error } = await supabase.from('comments').update({ content: editContent }).eq('id', row.id)
    if (error) {
      show({ title: 'Erro ao atualizar', description: error.message, variant: 'error' })
    } else {
      show({ title: 'Comentário atualizado', variant: 'success' })
      setEditingId(null)
      setEditContent('')
      await load()
    }
  }

  useEffect(() => { load() }, [])

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
    <div className="space-y-6 text-gray-100">
      <h2 className="text-2xl font-bold text-gold-500">Comentários</h2>
      {loading && <div className="text-gray-400">Carregando...</div>}
      <div className="border border-gold-500/30 rounded-md bg-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-800 text-gray-100">
              <th className="p-3">Autor</th>
              <th className="p-3">Comentário</th>
              <th className="p-3">Status</th>
              <th className="p-3 w-[28rem]">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {rows.map((r) => {
              const isStaff = r.is_staff_reply || (r.author_name || '').toLowerCase().includes('equipe neves')
              return (
                <tr key={r.id} className="border-t border-gray-700">
                  <td className="p-3">{r.author_name || 'Visitante'}</td>
                  <td className="p-3">
                    {editingId === r.id ? (
                      <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3}
                        className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-2 py-1" />
                    ) : (
                      r.content
                    )}
                  </td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3 space-y-2">
                    <div className="flex gap-2">
                      <button onClick={() => remove(r.id)} className="px-3 py-1 rounded-md border border-red-600 text-red-400 hover:bg-red-600 hover:text-white">Excluir</button>
                      {isStaff ? (
                        editingId === r.id ? (
                          <>
                            <button onClick={() => saveEdit(r)} className="px-3 py-1 rounded-md border border-green-600 text-green-400 hover:bg-green-600 hover:text-white">Salvar</button>
                            <button onClick={cancelEdit} className="px-3 py-1 rounded-md border border-gray-500 text-gray-300 hover:bg-gray-600">Cancelar</button>
                          </>
                        ) : (
                          <button onClick={() => startEdit(r)} className="px-3 py-1 rounded-md border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">Editar</button>
                        )
                      ) : null}
                    </div>
                    {!isStaff && (
                      <div className="flex gap-2">
                        <input
                          value={replying[r.id] || ''}
                          onChange={(e) => setReplying((prev) => ({ ...prev, [r.id]: e.target.value }))}
                          placeholder="Responder como equipe..."
                          className="border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-2 py-1 flex-1"
                        />
                        <button onClick={() => reply(r)} className="px-3 py-1 rounded-md bg-gold-500 text-gray-900 hover:bg-gold-600">Responder</button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">Sem comentários</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
