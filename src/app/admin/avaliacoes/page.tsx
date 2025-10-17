"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'
import { supabase } from '@/lib/supabaseClient'

type Review = {
  id?: string
  name: string
  rating: number
  comment: string
  comment_date: string
}

export default function AdminAvaliacoesPage() {
  const [items, setItems] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Review>({ name: '', rating: 5, comment: '', comment_date: new Date().toISOString().slice(0,10) })
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const router = useRouter()
  const { show } = useToast()

  const checkPerms = async () => {
    const { data } = await supabase.auth.getSession()
    const uid = data.session?.user?.id
    if (!uid) { router.push('/admin/login'); return false }
    
    try {
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', uid).single()
      const isAdmin = prof?.role === 'admin'
      const { data: perms } = await supabase.from('admin_permissions').select('*').eq('user_id', uid).maybeSingle()
      const canReviews = isAdmin || !!perms?.can_reviews
      
      if (!canReviews) { 
        show({ title: 'Acesso negado', description: 'Você não tem permissão para gerenciar avaliações.', variant: 'error' })
        router.push('/admin')
        return false 
      }
      setHasAccess(true)
      return true
    } catch {
      router.push('/admin')
      return false
    }
  }

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/reviews/list')
      const j = await r.json()
      setItems(j.items || [])
    } catch (e) { /* noop */ } finally { setLoading(false) }
  }

  useEffect(() => {
    checkPerms().then(hasAccess => {
      if (hasAccess) load()
    })
  }, [])

  const remove = async (id?: string) => {
    if (!id) return
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return
    try {
      const r = await fetch('/api/admin/reviews/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
      const j = await r.json()
      if (!r.ok) { show({ title: 'Falha ao excluir', description: j.error || undefined, variant: 'error' }); return }
      show({ title: 'Avaliação excluída com sucesso', variant: 'success' })
      await load()
    } catch (e: any) {
      show({ title: 'Erro ao excluir', description: String(e?.message || e), variant: 'error' })
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await fetch('/api/admin/reviews/upsert', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) })
      const j = await r.json()
      if (!r.ok) { show({ title: 'Falha ao salvar avaliação', description: j.error || undefined, variant: 'error' }); return }
      setForm({ name: '', rating: 5, comment: '', comment_date: new Date().toISOString().slice(0,10) })
      await load()
      show({ title: 'Avaliação salva com sucesso', variant: 'success' })
    } catch (e: any) {
      show({ title: 'Erro ao salvar', description: String(e?.message || e), variant: 'error' })
    } finally { setSaving(false) }
  }

  const edit = (it: Review) => setForm({ ...it })

  const stars = (n: number) => '★★★★★☆☆☆☆☆'.slice(5 - Math.max(1, Math.min(5, n)), 10 - Math.max(1, Math.min(5, n)))

  if (hasAccess === null) {
    return <div className="text-gray-300">Verificando permissões...</div>
  }

  if (!hasAccess) {
    return null
  }

  return (
    <div className="text-gray-100">
      <h2 className="text-2xl font-bold text-gold-500 mb-4">Avaliações</h2>

      <form onSubmit={submit} className="bg-gray-700 rounded-xl border border-gold-500/30 p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Nome</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Data</label>
          <input type="date" value={form.comment_date} onChange={e => setForm(f => ({ ...f, comment_date: e.target.value }))} className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Estrelas (1 a 5)</label>
          <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Math.max(1, Math.min(5, parseInt(e.target.value||'5'))) }))} className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-gray-300">Comentário</label>
          <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" rows={4} required />
        </div>
        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="submit" disabled={saving} className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-gray-600' : 'bg-gold-500 hover:bg-gold-600 text-gray-900 font-medium'}`}>{form.id ? 'Atualizar' : 'Salvar'}</button>
        </div>
      </form>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gold-500">Lista ({items.length})</h3>
        {loading && <span className="text-sm text-gray-400">Carregando...</span>}
      </div>

      <div className="grid gap-3">
        {items.map(it => (
          <div key={it.id} className="border border-gold-500/20 bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-100">{it.name}</div>
              <div className="text-gold-500" title={`${it.rating} estrelas`}>{'★'.repeat(it.rating)}{'☆'.repeat(5-it.rating)}</div>
            </div>
            <div className="text-xs text-gray-400">{new Date(it.comment_date).toLocaleDateString('pt-BR')}</div>
            <div className="text-sm mt-2 whitespace-pre-line text-gray-300">{it.comment}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-600 rounded text-gray-300 hover:bg-gray-600" onClick={() => edit(it)}>Editar</button>
              <button className="px-3 py-1 text-sm border border-red-600 rounded text-red-400 hover:bg-red-600 hover:text-white" onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
                  remove(it.id)
                }
              }}>Excluir</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-sm text-gray-400">Nenhuma avaliação encontrada.</div>}
      </div>
    </div>
  )
}
