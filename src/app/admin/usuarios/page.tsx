"use client"

import { useEffect, useState } from 'react'

type Perms = {
  is_admin: boolean
  can_posts: boolean
  can_reviews: boolean
  can_orders: boolean
  can_products: boolean
}

type UserRow = {
  id: string
  email: string
  created_at: string
  role: string | null
  permissions: (Perms & { user_id: string }) | null
}

const emptyPerms: Perms = { is_admin: false, can_posts: false, can_reviews: false, can_orders: false, can_products: false }

export default function AdminUsuariosPage() {
  const [items, setItems] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)

  const [createForm, setCreateForm] = useState<{ email: string; password: string; role: string; perms: Perms; username?: string; phone?: string; cpf?: string }>({ email: '', password: '', role: 'editor', perms: { ...emptyPerms }, username: '', phone: '', cpf: '' })
  const [editForm, setEditForm] = useState<{ user_id: string; email?: string; password?: string; role?: string; perms: Perms | null; username?: string; phone?: string; cpf?: string }>({ user_id: '', email: '', password: '', role: undefined, perms: null, username: '', phone: '', cpf: '' })
  const [showPwdCreate, setShowPwdCreate] = useState(false)
  const [showPwdEdit, setShowPwdEdit] = useState(false)

  const checkSuperAdmin = async () => {
    try {
      const { data } = await (await import('@/lib/supabaseClient')).supabase.auth.getSession()
      const email = data.session?.user?.email
      const isSuper = email?.toLowerCase() === 'jonatascosta.adv@gmail.com'
      setIsSuperAdmin(isSuper)
      if (!isSuper) {
        alert('Acesso negado. Apenas o administrador geral pode gerenciar usuários.')
        window.location.href = '/admin'
      }
    } catch {}
    finally { setCheckingAccess(false) }
  }

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/users/list')
      const j = await r.json()
      setItems(j.items || [])
    } catch (e) {} finally { setLoading(false) }
  }
  useEffect(() => { checkSuperAdmin(); load() }, [])

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await fetch('/api/admin/users/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: createForm.email, password: createForm.password, role: createForm.role, permissions: createForm.perms, username: createForm.username, phone: createForm.phone, cpf: createForm.cpf }) })
      const j = await r.json()
      if (!r.ok) { alert(j.error || 'Falha ao criar usuário'); return }
      setCreateForm({ email: '', password: '', role: 'editor', perms: { ...emptyPerms }, username: '', phone: '', cpf: '' })
      await load()
      alert('Usuário criado com sucesso')
    } catch (e: any) {
      alert('Erro: ' + (e?.message || e))
    } finally { setSaving(false) }
  }

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.user_id) return
    setSaving(true)
    try {
      const payload: any = { user_id: editForm.user_id }
      if (editForm.email) payload.email = editForm.email
      if (editForm.password) payload.password = editForm.password
      if (editForm.role) payload.role = editForm.role
      if (editForm.perms) payload.permissions = editForm.perms
      if (editForm.username) payload.username = editForm.username
      if (editForm.phone) payload.phone = editForm.phone
      if (editForm.cpf) payload.cpf = editForm.cpf
      const r = await fetch('/api/admin/users/update', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await r.json()
      if (!r.ok) { alert(j.error || 'Falha ao atualizar usuário'); return }
      setEditForm({ user_id: '', email: '', password: '', role: undefined, perms: null, username: '', phone: '', cpf: '' })
      await load()
      alert('Usuário atualizado com sucesso')
    } catch (e: any) {
      alert('Erro: ' + (e?.message || e))
    } finally { setSaving(false) }
  }

  if (checkingAccess) return <div>Verificando permissões...</div>
  if (!isSuperAdmin) return null

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Usuários</h2>
      <p className="text-sm text-gray-600 mb-4">Apenas o administrador geral (jonatascosta.adv@gmail.com) pode gerenciar usuários e permissões.</p>

      {/* Criar */}
      <form onSubmit={createUser} className="bg-white rounded-xl border p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Usuário</label>
          <input value={createForm.username || ''} onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input value={createForm.phone || ''} onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CPF</label>
          <input value={createForm.cpf || ''} onChange={e => setCreateForm(f => ({ ...f, cpf: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <div className="relative">
            <input type={showPwdCreate ? 'text' : 'password'} value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} className="w-full border rounded-md px-3 py-2 pr-10" required minLength={7} />
            <button type="button" onClick={() => setShowPwdCreate(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">{showPwdCreate ? '🙈' : '👁️'}</button>
          </div>
          <div className="text-xs text-gray-500 mt-1">Mínimo 7 caracteres</div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Função (role)</label>
          <select value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))} className="w-full border rounded-md px-3 py-2">
            <option value="admin">admin</option>
            <option value="editor">editor</option>
          </select>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { k: 'is_admin', label: 'Admin' },
            { k: 'can_posts', label: 'Posts' },
            { k: 'can_reviews', label: 'Avaliações' },
            { k: 'can_orders', label: 'Pedidos PDF' },
            { k: 'can_products', label: 'Produtos' },
          ].map(p => (
            <label key={p.k} className="flex items-center gap-2"><input type="checkbox" checked={(createForm.perms as any)[p.k]} onChange={e => setCreateForm(f => ({ ...f, perms: { ...f.perms, [p.k]: e.target.checked } }))} /> {p.label}</label>
          ))}
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={saving} className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-gray-400' : 'bg-primary-600'}`}>Criar usuário</button>
        </div>
      </form>

      {/* Editar */}
      {editForm.user_id && (
        <form onSubmit={updateUser} className="bg-white rounded-xl border p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Usuário</label>
            <input value={editForm.username || ''} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CPF</label>
            <input value={editForm.cpf || ''} onChange={e => setEditForm(f => ({ ...f, cpf: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nova Senha</label>
            <div className="relative">
              <input type={showPwdEdit ? 'text' : 'password'} value={editForm.password || ''} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} className="w-full border rounded-md px-3 py-2 pr-10" minLength={7} />
              <button type="button" onClick={() => setShowPwdEdit(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">{showPwdEdit ? '🙈' : '👁️'}</button>
            </div>
            <div className="text-xs text-gray-500 mt-1">Mínimo 7 caracteres</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Função (role)</label>
            <select value={editForm.role || ''} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} className="w-full border rounded-md px-3 py-2">
              <option value="">(manter)</option>
              <option value="admin">admin</option>
              <option value="editor">editor</option>
            </select>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { k: 'is_admin', label: 'Admin' },
              { k: 'can_posts', label: 'Posts' },
              { k: 'can_reviews', label: 'Avaliações' },
              { k: 'can_orders', label: 'Pedidos PDF' },
              { k: 'can_products', label: 'Produtos' },
            ].map(p => (
              <label key={p.k} className="flex items-center gap-2"><input type="checkbox" checked={!!(editForm.perms as any)?.[p.k]} onChange={e => setEditForm(f => ({ ...f, perms: { ...(f.perms || ({} as any)), [p.k]: e.target.checked } as any }))} /> {p.label}</label>
            ))}
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" className="px-4 py-2 border rounded-md" onClick={() => setEditForm({ user_id: '', email: '', password: '', role: undefined, perms: null })}>Cancelar</button>
            <button type="submit" disabled={saving} className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-gray-400' : 'bg-primary-600'}`}>Atualizar usuário</button>
          </div>
        </form>
      )}

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Lista ({items.length})</h3>
        {loading && <span className="text-sm text-gray-500">Carregando...</span>}
      </div>

      <div className="grid gap-3">
        {items.map(u => (
          <div key={u.id} className="border rounded-lg p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-xs text-gray-500">Criado em {new Date(u.created_at).toLocaleString('pt-BR')}</div>
              <div className="text-xs">Role: {u.role || '-'}</div>
              <div className="text-xs text-gray-600">Permissões: {u.permissions ? Object.entries(u.permissions).filter(([k]) => k !== 'user_id').map(([k,v]) => v ? k : null).filter(Boolean).join(', ') : '(nenhuma)'}</div>
              <div className="text-xs text-gray-500">Senha: ********** (criptografada)</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditForm({ user_id: u.id, email: u.email, password: '', role: u.role || undefined, perms: u.permissions ? { is_admin: !!u.permissions.is_admin, can_posts: !!u.permissions.can_posts, can_reviews: !!u.permissions.can_reviews, can_orders: !!u.permissions.can_orders, can_products: !!u.permissions.can_products } : { ...emptyPerms }, username: '', phone: '', cpf: '' })} className="px-3 py-1 text-sm border rounded">Editar</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-sm text-gray-600">Nenhum usuário encontrado.</div>}
      </div>
    </div>
  )
}
