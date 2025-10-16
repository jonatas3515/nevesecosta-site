"use client"

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'

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
  const router = useRouter()
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Product>({ name: '', price_cents: 0, promo_price_cents: null, image_url: '', active: true })
  const { show } = useToast()

  const currencyBRL = (v?: number | null) => typeof v === 'number' ? (v/100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''

  const defaultProduct = useMemo(() => items.find(i => i.name?.toLowerCase() === 'cálculo em pdf'), [items])

  const checkPerms = async () => {
    const { data } = await supabase.auth.getSession()
    const uid = data.session?.user?.id
    if (!uid) { router.push('/admin/login'); return false }
    const { data: prof } = await supabase.from('profiles').select('role').eq('id', uid).single()
    const isAdmin = prof?.role === 'admin'
    const { data: perms } = await supabase.from('admin_permissions').select('*').eq('user_id', uid).maybeSingle()
    const can = isAdmin || !!perms?.can_products
    if (!can) { router.push('/admin'); return false }
    return true
  }

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/products/list')
      const j = await r.json()
      setItems(j.items || [])
    } catch (e) {} finally { setLoading(false) }
  }

  useEffect(() => { (async () => { if (await checkPerms()) await load() })() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await fetch('/api/admin/products/upsert', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form)
      })
      const j = await r.json()
      if (!r.ok) { show({ title: 'Falha ao salvar produto', description: j.error || undefined, variant: 'error' }); return }
      setForm({ name: '', price_cents: 0, promo_price_cents: null, image_url: '', active: true })
      await load()
      show({ title: 'Produto salvo com sucesso', variant: 'success' })
    } catch (e: any) {
      show({ title: 'Erro ao salvar', description: String(e?.message || e), variant: 'error' })
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
    if (!confirm('Tem certeza que deseja desativar este produto?')) return
    const r = await fetch('/api/admin/products/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    if (!r.ok) { const j = await r.json(); show({ title: 'Falha ao desativar', description: j.error || undefined, variant: 'error' }); return }
    show({ title: 'Produto desativado', variant: 'success' })
    await load()
  }

  useEffect(() => {
    // Se não existir o produto padrão, pré-preencher o formulário com Cálculo em PDF 75,00
    if (!defaultProduct && !form.id && !form.name) {
      setForm({ name: 'Cálculo em PDF', price_cents: 7500, promo_price_cents: null, image_url: '', active: true })
    }
  }, [defaultProduct])

  return (
    <div className="text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gold-500">Produtos</h2>

      <form onSubmit={submit} className="bg-gray-700 rounded-xl border border-gold-500/30 p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Nome</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Preço (R$)</label>
          <input type="number" step="0.01" value={(form.price_cents/100).toString()} onChange={e => setForm(f => ({ ...f, price_cents: Math.round(parseFloat(e.target.value||'0') * 100) }))} className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Preço Promocional (R$)</label>
          <input type="number" step="0.01" value={form.promo_price_cents ? (form.promo_price_cents/100).toString() : ''} onChange={e => setForm(f => ({ ...f, promo_price_cents: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null }))} className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Imagem (URL)</label>
          <input value={form.image_url || ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" checked={!!form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
          <label htmlFor="active" className="text-gray-300">Ativo</label>
        </div>
        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="submit" disabled={saving} className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-gray-600' : 'bg-gold-500 hover:bg-gold-600 text-gray-900'}`}>{form.id ? 'Atualizar' : 'Salvar'}</button>
        </div>
        {!!form.stripe_price_id && (
          <div className="md:col-span-2 text-sm text-green-400">Sincronizado com Stripe: {form.stripe_price_id}</div>
        )}
      </form>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Lista ({items.length})</h3>
        {loading && <span className="text-sm text-gray-500">Carregando...</span>}
      </div>

      <div className="grid gap-3">
        {items.map(p => (
          <div key={p.id} className="border border-gold-500/20 bg-gray-700 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {p.image_url ? <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded object-cover"/> : <div className="w-12 h-12 rounded bg-gray-600"/>}
              <div>
                <div className="font-medium text-gray-100">{p.name} {p.active ? '' : <span className="ml-2 text-xs text-gray-400">(inativo)</span>}</div>
                <div className="text-sm text-gray-300">
                  {currencyBRL(p.promo_price_cents || p.price_cents)}
                  {p.promo_price_cents ? <span className="ml-2 line-through text-xs text-gray-400">{currencyBRL(p.price_cents)}</span> : null}
                </div>
                {p.stripe_price_id && <div className="text-xs text-green-400">Stripe: {p.stripe_price_id}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => edit(p)} className="px-3 py-1 text-sm border border-gray-600 rounded text-gray-200 hover:bg-gray-600">Editar</button>
              <button onClick={() => del(p.id)} className="px-3 py-1 text-sm border border-red-600 rounded text-red-400 hover:bg-red-600 hover:text-white">Excluir</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-sm text-gray-400">Nenhum produto cadastrado.</div>}
      </div>
    </div>
  )
}
