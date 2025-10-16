'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/toast-context'

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
  username: string | null
  phone: string | null
  cpf: string | null
  permissions: (Perms & { user_id: string }) | null
}

const emptyPerms: Perms = { is_admin: false, can_posts: false, can_reviews: false, can_orders: false, can_products: false }

export default function AdminUsuariosPage() {
  const [items, setItems] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [changingPasswordUserId, setChangingPasswordUserId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const { showToast } = useToast()

  const [createForm, setCreateForm] = useState<{ email: string; password: string; role: string; perms: Perms; username?: string; phone?: string; cpf?: string }>({ 
    email: '', password: '', role: 'editor', perms: { ...emptyPerms }, username: '', phone: '', cpf: '' 
  })
  
  const [editForm, setEditForm] = useState<{ user_id: string; email?: string; role?: string; perms: Perms | null; username?: string; phone?: string; cpf?: string }>({ 
    user_id: '', email: '', role: undefined, perms: null, username: '', phone: '', cpf: '' 
  })

  const checkSuperAdmin = async () => {
    try {
      const { data } = await (await import('@/lib/supabaseClient')).supabase.auth.getSession()
      const email = data.session?.user?.email
      const isSuper = email?.toLowerCase() === 'jonatascosta.adv@gmail.com'
      setIsSuperAdmin(isSuper)
      if (!isSuper) {
        showToast('Acesso negado. Apenas o administrador geral pode gerenciar usuários.', 'error')
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
      // Filter out super admin from list
      const filtered = (j.items || []).filter((u: UserRow) => u.email?.toLowerCase() !== 'jonatascosta.adv@gmail.com')
      setItems(filtered)
    } catch (e) {} finally { setLoading(false) }
  }

  useEffect(() => { checkSuperAdmin(); load() }, [])

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await fetch('/api/admin/users/create', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ 
          email: createForm.email, 
          password: createForm.password, 
          role: createForm.role, 
          permissions: createForm.perms, 
          username: createForm.username, 
          phone: createForm.phone, 
          cpf: createForm.cpf 
        }) 
      })
      const j = await r.json()
      if (!r.ok) { showToast(j.error || 'Falha ao criar usuário', 'error'); return }
      setCreateForm({ email: '', password: '', role: 'editor', perms: { ...emptyPerms }, username: '', phone: '', cpf: '' })
      setShowCreateForm(false)
      await load()
      showToast('Usuário criado com sucesso', 'success')
    } catch (e: any) {
      showToast('Erro: ' + (e?.message || e), 'error')
    } finally { setSaving(false) }
  }

  const updateUser = async (userId: string) => {
    setSaving(true)
    try {
      const payload: any = { user_id: userId }
      if (editForm.email) payload.email = editForm.email
      if (editForm.role) payload.role = editForm.role
      if (editForm.perms) payload.permissions = editForm.perms
      if (editForm.username) payload.username = editForm.username
      if (editForm.phone) payload.phone = editForm.phone
      if (editForm.cpf) payload.cpf = editForm.cpf
      
      const r = await fetch('/api/admin/users/update', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await r.json()
      if (!r.ok) { showToast(j.error || 'Falha ao atualizar usuário', 'error'); return }
      setEditingUserId(null)
      setEditForm({ user_id: '', email: '', role: undefined, perms: null, username: '', phone: '', cpf: '' })
      await load()
      showToast('Usuário atualizado com sucesso', 'success')
    } catch (e: any) {
      showToast('Erro: ' + (e?.message || e), 'error')
    } finally { setSaving(false) }
  }

  const changePassword = async (userId: string) => {
    if (!newPassword || newPassword.length < 7) {
      showToast('Senha deve ter no mínimo 7 caracteres', 'warning')
      return
    }
    setSaving(true)
    try {
      const r = await fetch('/api/admin/users/update', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ user_id: userId, password: newPassword }) 
      })
      const j = await r.json()
      if (!r.ok) { showToast(j.error || 'Falha ao alterar senha', 'error'); return }
      setChangingPasswordUserId(null)
      setNewPassword('')
      showToast('Senha alterada com sucesso', 'success')
    } catch (e: any) {
      showToast('Erro: ' + (e?.message || e), 'error')
    } finally { setSaving(false) }
  }

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Tem certeza que deseja remover o usuário ${email}?`)) return
    try {
      const r = await fetch('/api/admin/users/delete', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ user_id: userId }) 
      })
      const j = await r.json()
      if (!r.ok) { showToast(j.error || 'Falha ao remover usuário', 'error'); return }
      await load()
      showToast('Usuário removido com sucesso', 'success')
    } catch (e: any) {
      showToast('Erro: ' + (e?.message || e), 'error')
    }
  }

  if (checkingAccess) return <div className="text-gray-300">Verificando permissões...</div>
  if (!isSuperAdmin) return null

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gold-500">Gerenciamento de Usuários</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-gold-500 text-gray-900 rounded-md hover:bg-gold-600 font-medium"
        >
          {showCreateForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <form onSubmit={createUser} className="bg-gray-700 rounded-xl border border-gold-500/30 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gold-500 mb-4">Criar Novo Usuário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Email *</label>
              <input value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} 
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Usuário (login)</label>
              <input value={createForm.username || ''} onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))} 
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Senha * (mín. 7 caracteres)</label>
              <input type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} 
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" required minLength={7} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Função</label>
              <select value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))} 
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2">
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">Permissões</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { key: 'can_posts', label: 'Posts' },
                { key: 'can_reviews', label: 'Avaliações' },
                { key: 'can_orders', label: 'Pedidos PDF' },
                { key: 'can_products', label: 'Produtos' },
              ].map(p => (
                <label key={p.key} className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={(createForm.perms as any)[p.key]} 
                    onChange={e => setCreateForm(f => ({ ...f, perms: { ...f.perms, [p.key]: e.target.checked } }))} 
                    className="rounded" />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving} 
            className={`px-6 py-2 rounded-md text-white font-medium ${saving ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'}`}>
            {saving ? 'Criando...' : 'Criar Usuário'}
          </button>
        </form>
      )}

      {/* Users List */}
      <div className="space-y-3">
        {loading && <div className="text-gray-400">Carregando...</div>}
        {items.map(u => (
          <div key={u.id} className="bg-gray-700 border border-gold-500/20 rounded-lg p-4">
            {editingUserId === u.id ? (
              // Edit Mode
              <div>
                <h4 className="text-gold-500 font-semibold mb-3">Editando: {u.email}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Email</label>
                    <input value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} 
                      className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded px-2 py-1 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Usuário</label>
                    <input value={editForm.username || ''} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} 
                      className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded px-2 py-1 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Função</label>
                    <select value={editForm.role || u.role || 'editor'} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} 
                      className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded px-2 py-1 text-sm">
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-400 mb-2">Permissões</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { key: 'can_posts', label: 'Posts' },
                      { key: 'can_reviews', label: 'Avaliações' },
                      { key: 'can_orders', label: 'Pedidos PDF' },
                      { key: 'can_products', label: 'Produtos' },
                    ].map(p => (
                      <label key={p.key} className="flex items-center gap-1 text-xs text-gray-300">
                        <input type="checkbox" checked={(editForm.perms as any)?.[p.key] || false} 
                          onChange={e => setEditForm(f => ({ ...f, perms: { ...(f.perms || emptyPerms), [p.key]: e.target.checked } }))} 
                          className="rounded" />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateUser(u.id)} disabled={saving}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-600">
                    Salvar
                  </button>
                  <button onClick={() => { setEditingUserId(null); setEditForm({ user_id: '', email: '', role: undefined, perms: null, username: '', phone: '', cpf: '' }) }}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gold-500">{u.email}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-red-600' : 'bg-blue-600'} text-white`}>
                        {u.role || 'editor'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-300">
                      <div><span className="text-gray-400">Login:</span> {u.username || u.email}</div>
                      <div><span className="text-gray-400">Senha:</span> ••••••••</div>
                      <div><span className="text-gray-400">Permissões:</span> {u.permissions ? Object.entries(u.permissions).filter(([k]) => k !== 'user_id' && k !== 'is_admin').map(([k,v]) => v ? k.replace('can_', '') : null).filter(Boolean).join(', ') || 'Nenhuma' : 'Nenhuma'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { 
                      setEditingUserId(u.id); 
                      setEditForm({ 
                        user_id: u.id, 
                        email: u.email, 
                        role: u.role || 'editor', 
                        perms: u.permissions ? { 
                          is_admin: !!u.permissions.is_admin, 
                          can_posts: !!u.permissions.can_posts, 
                          can_reviews: !!u.permissions.can_reviews, 
                          can_orders: !!u.permissions.can_orders, 
                          can_products: !!u.permissions.can_products 
                        } : { ...emptyPerms }, 
                        username: u.username || '', 
                        phone: u.phone || '', 
                        cpf: u.cpf || '' 
                      }) 
                    }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      ✏️ Editar
                    </button>
                    <button onClick={() => { setChangingPasswordUserId(u.id); setNewPassword('') }}
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                      🔑 Alterar Senha
                    </button>
                    <button onClick={() => deleteUser(u.id, u.email)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                      🗑️ Remover
                    </button>
                  </div>
                </div>
                {changingPasswordUserId === u.id && (
                  <div className="mt-3 p-3 bg-gray-800 rounded border border-yellow-500/30">
                    <label className="block text-sm text-gray-300 mb-2">Nova Senha (mín. 7 caracteres)</label>
                    <div className="flex gap-2">
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} 
                        className="flex-1 border border-gray-600 bg-gray-900 text-gray-100 rounded px-3 py-1 text-sm" 
                        placeholder="Digite a nova senha" minLength={7} />
                      <button onClick={() => changePassword(u.id)} disabled={saving}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-600">
                        Salvar
                      </button>
                      <button onClick={() => { setChangingPasswordUserId(null); setNewPassword('') }}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-gray-400 text-center py-8">Nenhum usuário cadastrado ainda.</div>}
      </div>
    </div>
  )
}
