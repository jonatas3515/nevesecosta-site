"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { v4 as uuidv4 } from "uuid"

type TeamMember = {
  id: string
  slug: string
  name: string
  oab?: string | null
  photo_url?: string | null
  specialties?: string[] | null
  bio?: string | null
  curriculum?: string | null
  lattes_id?: string | null
  lattes_url?: string | null
  lattes_updated_at?: string | null
  email?: string | null
  social_media?: string | null
}

export default function AdminTeamPage() {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const [form, setForm] = useState<Omit<TeamMember, "id">>({
    slug: "",
    name: "",
    oab: "",
    photo_url: "",
    specialties: [],
    bio: "",
    curriculum: "",
    lattes_id: "",
    lattes_url: "",
    lattes_updated_at: "",
    email: "",
    social_media: ""
  })

  useEffect(() => { load() }, [])

  const canSave = useMemo(() => !!form.name && !!form.slug, [form])

  const load = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("team_members").select("*").order("name")
      if (error) throw error
      setMembers(data as TeamMember[])
    } catch (e) {
      console.error("[AdminTeam] load error", e)
    } finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({
      slug: "",
      name: "",
      oab: "",
      photo_url: "",
      specialties: [],
      bio: "",
      curriculum: "",
      lattes_id: "",
      lattes_url: "",
      lattes_updated_at: "",
      email: "",
      social_media: ""
    })
    setFile(null)
    setShowModal(true)
  }

  const openEdit = (m: TeamMember) => {
    setEditing(m)
    setForm({
      slug: m.slug,
      name: m.name,
      oab: m.oab || "",
      photo_url: m.photo_url || "",
      specialties: m.specialties || [],
      bio: m.bio || "",
      curriculum: m.curriculum || "",
      lattes_id: m.lattes_id || "",
      lattes_url: m.lattes_url || "",
      lattes_updated_at: m.lattes_updated_at || "",
      email: m.email || "",
      social_media: m.social_media || ""
    })
    setFile(null)
    setShowModal(true)
  }

  const handleUpload = async (): Promise<string | undefined> => {
    if (!file) return form.photo_url || undefined
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${form.slug || uuidv4()}.${ext}`
    const { error } = await supabase.storage.from("team-photos").upload(path, file, { upsert: true, cacheControl: "3600" })
    if (error) throw error
    const { data: pub } = supabase.storage.from("team-photos").getPublicUrl(path)
    return pub.publicUrl
  }

  const save = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      const photo_url = await handleUpload()
      const payload = { ...form, photo_url, specialties: form.specialties && Array.isArray(form.specialties) ? form.specialties : [] }
      if (editing) {
        const { error } = await supabase.from("team_members").update(payload).eq("id", editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("team_members").insert([{ id: uuidv4(), ...payload }])
        if (error) throw error
      }
      setShowModal(false)
      await load()
    } catch (e: any) {
      alert("Erro ao salvar: " + (e?.message || String(e)))
    } finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este membro?")) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from("team_members").delete().eq("id", id)
      if (error) throw error
      await load()
    } catch (e: any) {
      alert("Erro ao excluir: " + (e?.message || String(e)))
    } finally { setDeletingId(null) }
  }

  const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gold-500">Gerenciar Equipe</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-gold-500 text-gray-900 rounded-md hover:bg-gold-600">Adicionar Membro</button>
      </div>

      {loading ? (
        <div className="text-gray-300">Carregando...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {members.map(m => (
            <div key={m.id} className="border border-gold-500/20 rounded-lg p-4 bg-gray-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-white font-semibold">{m.name}</div>
                  <div className="text-sm text-gold-400">{m.oab}</div>
                  <div className="text-xs text-gray-400">slug: {m.slug}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(m.specialties || []).map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(m)} className="px-3 py-1 rounded-md text-sm bg-gray-700 hover:bg-gray-600">Editar</button>
                  <button onClick={() => remove(m.id)} disabled={deletingId===m.id} className="px-3 py-1 rounded-md text-sm bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50">{deletingId===m.id? 'Excluindo...' : 'Excluir'}</button>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-gray-300">Nenhum membro cadastrado.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-gray-800 border border-gold-500/30 rounded-xl p-4 w-full max-w-3xl mx-4 my-auto">
            <h3 className="text-lg font-semibold text-gold-500 mb-3">{editing ? 'Editar Membro' : 'Novo Membro'}</h3>
            <div className="grid md:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-2">
              {/* Dados BÃ¡sicos */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Nome Completo *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value, slug: f.slug || toSlug(e.target.value)}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: Jonatas do Nascimento Costa" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Slug *</label>
                <input value={form.slug} onChange={e => setForm(f => ({...f, slug: toSlug(e.target.value)}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: jonatas-costa" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">OAB</label>
                <input value={form.oab || ''} onChange={e => setForm(f => ({...f, oab: e.target.value}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: OAB/BA n.Âº 69.148" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Foto</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-gray-300" />
                {form.photo_url && <div className="text-xs text-gray-400 mt-1 truncate">Atual: {form.photo_url}</div>}
              </div>

              {/* Contato */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input type="email" value={form.email || ''} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: jonatascosta.adv@gmail.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Redes Sociais</label>
                <input value={form.social_media || ''} onChange={e => setForm(f => ({...f, social_media: e.target.value}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: @jonatascosta.adv" />
              </div>

              {/* Especialidades */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Especialidades (separe por vÃ­rgula)</label>
                <input value={(form.specialties||[]).join(', ')} onChange={e => setForm(f => ({...f, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: CÃ­vel, Trabalhista, Consumidor" />
              </div>

              {/* Lattes */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Lattes ID</label>
                <input value={form.lattes_id || ''} onChange={e => setForm(f => ({...f, lattes_id: e.target.value}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: 3222982073576723" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Data AtualizaÃ§Ã£o Lattes</label>
                <input type="date" value={form.lattes_updated_at || ''} onChange={e => setForm(f => ({...f, lattes_updated_at: e.target.value}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Lattes URL</label>
                <input type="url" value={form.lattes_url || ''} onChange={e => setForm(f => ({...f, lattes_url: e.target.value}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: http://lattes.cnpq.br/3222982073576723" />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Biografia/Resumo</label>
                <textarea value={form.bio || ''} onChange={e => setForm(f => ({...f, bio: e.target.value}))} rows={4} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Breve descriÃ§Ã£o profissional..." />
              </div>

              {/* CurrÃ­culo */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">FormaÃ§Ã£o AcadÃªmica/TitulaÃ§Ã£o</label>
                <textarea value={form.curriculum || ''} onChange={e => setForm(f => ({...f, curriculum: e.target.value}))} rows={10} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Liste a formaÃ§Ã£o acadÃªmica completa (use linhas em branco para separar cada item)..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-700">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500">Cancelar</button>
              <button onClick={save} disabled={!canSave || saving} className="px-4 py-2 rounded-md bg-gold-500 text-gray-900 disabled:bg-gray-600 hover:bg-gold-400">{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
