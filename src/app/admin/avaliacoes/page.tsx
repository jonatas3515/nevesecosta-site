"use client"

import { useEffect, useState } from 'react'

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

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/reviews/list')
      const j = await r.json()
      setItems(j.items || [])
    } catch (e) { /* noop */ } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await fetch('/api/admin/reviews/upsert', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) })
      const j = await r.json()
      if (!r.ok) { alert(j.error || 'Falha ao salvar avaliação'); return }
      setForm({ name: '', rating: 5, comment: '', comment_date: new Date().toISOString().slice(0,10) })
      await load()
      alert('Avaliação salva com sucesso')
    } catch (e: any) {
      alert('Erro: ' + (e?.message || e))
    } finally { setSaving(false) }
  }

  const edit = (it: Review) => setForm({ ...it })

  const stars = (n: number) => '★★★★★☆☆☆☆☆'.slice(5 - Math.max(1, Math.min(5, n)), 10 - Math.max(1, Math.min(5, n)))

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Avaliações</h2>

      <form onSubmit={submit} className="bg-white rounded-xl border p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input type="date" value={form.comment_date} onChange={e => setForm(f => ({ ...f, comment_date: e.target.value }))} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estrelas (1 a 5)</label>
          <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Math.max(1, Math.min(5, parseInt(e.target.value||'5'))) }))} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Comentário</label>
          <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} className="w-full border rounded-md px-3 py-2" rows={4} required />
        </div>
        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="submit" disabled={saving} className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-gray-400' : 'bg-primary-600'}`}>{form.id ? 'Atualizar' : 'Salvar'}</button>
        </div>
      </form>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Lista ({items.length})</h3>
        {loading && <span className="text-sm text-gray-500">Carregando...</span>}
      </div>

      <div className="grid gap-3">
        {items.map(it => (
          <div key={it.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{it.name}</div>
              <div className="text-yellow-600" title={`${it.rating} estrelas`}>{'★'.repeat(it.rating)}{'☆'.repeat(5-it.rating)}</div>
            </div>
            <div className="text-xs text-gray-500">{new Date(it.comment_date).toLocaleDateString('pt-BR')}</div>
            <div className="text-sm mt-2 whitespace-pre-line">{it.comment}</div>
            <div className="mt-2">
              <button className="px-3 py-1 text-sm border rounded" onClick={() => edit(it)}>Editar</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-sm text-gray-600">Nenhuma avaliação cadastrada.</div>}
      </div>
    </div>
  )
}
