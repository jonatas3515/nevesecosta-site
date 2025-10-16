"use client"

import { useEffect, useMemo, useState } from 'react'

type Product = {
  id?: string
  name: string
  price_cents: number
  promo_price_cents?: number | null
  image_url?: string | null
  active: boolean
  stripe_product_id?: string | null
  stripe_price_id?: string | null
}

export default function AdminProdutosPage() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Product>({ name: '', price_cents: 0, promo_price_cents: null, image_url: '', active: true })

  const currencyBRL = (v?: number | null) => typeof v === 'number' ? (v/100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''

  const defaultProduct = useMemo(() => items.find(i => i.name?.toLowerCase() === 'cálculo em pdf'), [items])

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/products/list')
      const j = await r.json()
      setItems(j.items || [])
    } catch (e) {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await fetch('/api/admin/products/upsert', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form)
      })
      const j = await r.json()
      if (!r.ok) { alert(j.error || 'Falha ao salvar produto'); return }
      setForm({ name: '', price_cents: 0, promo_price_cents: null, image_url: '', active: true })
      await load()
      alert('Produto salvo com sucesso')
    } catch (e: any) {
      alert('Erro: ' + (e?.message || e))
    } finally { setSaving(false) }
  }

  const edit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      price_cents: p.price_cents,
      promo_price_cents: p.promo_price_cents ?? null,
      image_url: p.image_url ?? '',
      active: p.active,
      stripe_product_id: p.stripe_product_id || undefined,
      stripe_price_id: p.stripe_price_id || undefined,
    })
  }

  const del = async (id?: string) => {
    if (!id) return
    if (!confirm('Desativar este produto?')) return
    const r = await fetch('/api/admin/products/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    if (!r.ok) { const j = await r.json(); alert(j.error || 'Falha ao desativar'); return }
    await load()
  }

  useEffect(() => {
    // Se não existir o produto padrão, pré-preencher o formulário com Cálculo em PDF 75,00
    if (!defaultProduct && !form.id && !form.name) {
      setForm({ name: 'Cálculo em PDF', price_cents: 7500, promo_price_cents: null, image_url: '', active: true })
    }
  }, [defaultProduct])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Produtos</h2>

      <form onSubmit={submit} className="bg-white rounded-xl border p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preço (R$)</label>
          <input type="number" step="0.01" value={(form.price_cents/100).toString()} onChange={e => setForm(f => ({ ...f, price_cents: Math.round(parseFloat(e.target.value||'0') * 100) }))} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preço Promocional (R$)</label>
          <input type="number" step="0.01" value={form.promo_price_cents ? (form.promo_price_cents/100).toString() : ''} onChange={e => setForm(f => ({ ...f, promo_price_cents: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null }))} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagem (URL)</label>
          <input value={form.image_url || ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" checked={!!form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
          <label htmlFor="active">Ativo</label>
        </div>
        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="submit" disabled={saving} className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-gray-400' : 'bg-primary-600'}`}>{form.id ? 'Atualizar' : 'Salvar'}</button>
        </div>
        {!!form.stripe_price_id && (
          <div className="md:col-span-2 text-sm text-green-700">Sincronizado com Stripe: {form.stripe_price_id}</div>
        )}
      </form>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Lista ({items.length})</h3>
        {loading && <span className="text-sm text-gray-500">Carregando...</span>}
      </div>

      <div className="grid gap-3">
        {items.map(p => (
          <div key={p.id} className="border rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {p.image_url ? <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded object-cover"/> : <div className="w-12 h-12 rounded bg-gray-200"/>}
              <div>
                <div className="font-medium">{p.name} {p.active ? '' : <span className="ml-2 text-xs text-gray-500">(inativo)</span>}</div>
                <div className="text-sm text-gray-600">
                  {currencyBRL(p.promo_price_cents || p.price_cents)}
                  {p.promo_price_cents ? <span className="ml-2 line-through text-xs">{currencyBRL(p.price_cents)}</span> : null}
                </div>
                {p.stripe_price_id && <div className="text-xs text-green-700">Stripe: {p.stripe_price_id}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => edit(p)} className="px-3 py-1 text-sm border rounded">Editar</button>
              <button onClick={() => del(p.id)} className="px-3 py-1 text-sm border rounded text-red-600">Excluir</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-sm text-gray-600">Nenhum produto cadastrado.</div>}
      </div>
    </div>
  )
}
