"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { supabase } from "@/lib/supabaseClient"
import { v4 as uuidv4 } from "uuid"

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

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
  phone?: string | null
  academic_education?: string | null
  complementary_training?: string | null
  professional_experience?: string | null
}

type ComplementaryBlockInput = {
  id?: string
  category_title: string
  courses_text: string
  title_color: string
  text_color: string
  text_align: 'left' | 'center' | 'justify'
  sort_order: number
}

export default function AdminTeamPage() {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [complementaryBlocks, setComplementaryBlocks] = useState<ComplementaryBlockInput[]>([])

  const [form, setForm] = useState<Omit<TeamMember, "id" | "complementary_training">>({
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
    social_media: "",
    phone: "",
    academic_education: "",
    professional_experience: ""
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
      social_media: "",
      phone: "",
      academic_education: "",
      professional_experience: ""
    })
    setComplementaryBlocks([])
    setFile(null)
    setShowModal(true)
  }

  const openEdit = async (m: TeamMember) => {
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
      social_media: m.social_media || "",
      phone: m.phone || "",
      academic_education: m.academic_education || "",
      professional_experience: m.professional_experience || ""
    })
    setFile(null)
    setComplementaryBlocks([])
    try {
      const { data, error } = await supabase
        .from("team_complementary_blocks")
        .select("*")
        .eq("member_id", m.id)
        .order("sort_order", { ascending: true })
      if (error) throw error
      if (data) {
        setComplementaryBlocks(data.map((b: any) => ({
          id: b.id,
          category_title: b.category_title,
          courses_text: b.courses_text,
          title_color: b.title_color,
          text_color: b.text_color,
          text_align: b.text_align,
          sort_order: b.sort_order
        })))
      }
    } catch (e: any) {
      console.error("[AdminTeam] load blocks error", e)
    }
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
      const memberId = editing ? editing.id : uuidv4()
      const payload = { ...form, photo_url, specialties: form.specialties && Array.isArray(form.specialties) ? form.specialties : [] }
      if (editing) {
        const { error } = await supabase.from("team_members").update(payload).eq("id", memberId)
        if (error) throw error
      } else {
        const { error } = await supabase.from("team_members").insert([{ id: memberId, ...payload }])
        if (error) throw error
      }

      const validBlocks = complementaryBlocks
        .filter(b => b.category_title.trim() || b.courses_text.trim())
        .slice(0, 10)
        .map((b, idx) => ({
          member_id: memberId,
          category_title: b.category_title.trim(),
          courses_text: b.courses_text.trim(),
          title_color: b.title_color,
          text_color: b.text_color,
          text_align: b.text_align,
          sort_order: b.sort_order ?? idx
        }))

      const { error: delError } = await supabase.from("team_complementary_blocks").delete().eq("member_id", memberId)
      if (delError) throw delError

      if (validBlocks.length > 0) {
        const { error: insError } = await supabase.from("team_complementary_blocks").insert(validBlocks)
        if (insError) throw insError
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

  const addComplementaryBlock = () => {
    if (complementaryBlocks.length >= 10) return
    setComplementaryBlocks(prev => [...prev, {
      category_title: "",
      courses_text: "",
      title_color: "#fbbf24",
      text_color: "#e2e8f0",
      text_align: 'left',
      sort_order: prev.length
    }])
  }

  const updateComplementaryBlock = (index: number, patch: Partial<ComplementaryBlockInput>) => {
    setComplementaryBlocks(prev => prev.map((b, i) => i === index ? { ...b, ...patch } : b))
  }

  const removeComplementaryBlock = (index: number) => {
    setComplementaryBlocks(prev => prev.filter((_, i) => i !== index))
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
                <label className="block text-sm text-gray-300 mb-1">Telefone profissional</label>
                <input type="tel" value={form.phone || ''} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100" placeholder="Ex: (73) 9 9934-8552" />
              </div>
              <div className="md:col-span-2">
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
                <div className="bg-gray-800 rounded-md border border-gray-600 overflow-hidden">
                  <MDEditor value={form.bio || ''} onChange={(v) => setForm(f => ({...f, bio: (v || '').toString()}))} height={140} preview="edit" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Os textos são justificados automaticamente no site. Use Markdown: **negrito**, *itálico*, ~~tachado~~, listas e links. Não use tags HTML.</p>
              </div>

              {/* Formação Acadêmica */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Formação Acadêmica</label>
                <div className="bg-gray-800 rounded-md border border-gray-600 overflow-hidden">
                  <MDEditor value={form.academic_education || ''} onChange={(v) => setForm(f => ({...f, academic_education: (v || '').toString()}))} height={180} preview="edit" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Os textos são justificados automaticamente no site. Use Markdown: **negrito**, *itálico*, ~~tachado~~, listas e links. Não use tags HTML.</p>
              </div>

              {/* Formação Complementar — Blocos Estruturados */}
              <div className="md:col-span-2 border-t border-gray-700 pt-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-gray-300">Formação Complementar</label>
                  <button
                    type="button"
                    onClick={addComplementaryBlock}
                    disabled={complementaryBlocks.length >= 10}
                    className="px-3 py-1.5 text-xs bg-gold-500 text-gray-900 rounded-md hover:bg-gold-400 disabled:bg-gray-600 disabled:text-gray-300"
                  >
                    Adicionar Bloco ({complementaryBlocks.length}/10)
                  </button>
                </div>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {complementaryBlocks.map((block, index) => (
                    <div key={block.id || `block-${index}`} className="bg-gray-800 rounded-lg p-4 border border-gray-600 space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-1">Título da Categoria</label>
                          <input
                            value={block.category_title}
                            onChange={e => updateComplementaryBlock(index, { category_title: e.target.value })}
                            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
                            placeholder="Ex: Cibersegurança"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-1">Itens/Cursos (um por linha)</label>
                          <textarea
                            value={block.courses_text}
                            onChange={e => updateComplementaryBlock(index, { courses_text: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
                            placeholder="Ex: Programa Hackers do Bem - 96h"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Cor do Título</label>
                          <input
                            type="color"
                            value={block.title_color}
                            onChange={e => updateComplementaryBlock(index, { title_color: e.target.value })}
                            className="w-full h-10 rounded-md bg-gray-700 border border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Cor do Texto</label>
                          <input
                            type="color"
                            value={block.text_color}
                            onChange={e => updateComplementaryBlock(index, { text_color: e.target.value })}
                            className="w-full h-10 rounded-md bg-gray-700 border border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Alinhamento</label>
                          <select
                            value={block.text_align}
                            onChange={e => updateComplementaryBlock(index, { text_align: e.target.value as 'left' | 'center' | 'justify' })}
                            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
                          >
                            <option value="left">Esquerda</option>
                            <option value="center">Centro</option>
                            <option value="justify">Justificado</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Ordem</label>
                          <input
                            type="number"
                            min={0}
                            value={block.sort_order}
                            onChange={e => updateComplementaryBlock(index, { sort_order: parseInt(e.target.value || '0', 10) })}
                            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeComplementaryBlock(index)}
                          className="px-3 py-1 text-xs bg-red-500/20 text-red-300 border border-red-500/30 rounded-md hover:bg-red-500/30"
                        >
                          Remover Bloco
                        </button>
                      </div>
                    </div>
                  ))}
                  {complementaryBlocks.length === 0 && (
                    <p className="text-sm text-gray-400">Nenhum bloco cadastrado. Clique em "Adicionar Bloco" para começar.</p>
                  )}
                </div>
              </div>

              {/* Experiência Profissional */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Experiência Profissional</label>
                <div className="bg-gray-800 rounded-md border border-gray-600 overflow-hidden">
                  <MDEditor value={form.professional_experience || ''} onChange={(v) => setForm(f => ({...f, professional_experience: (v || '').toString()}))} height={180} preview="edit" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Os textos são justificados automaticamente no site. Use Markdown: **negrito**, *itálico*, ~~tachado~~, listas e links. Não use tags HTML.</p>
              </div>

              {/* Currículo livre / observações internas */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Currículo livre / observações internas (opcional)</label>
                <div className="bg-gray-800 rounded-md border border-gray-600 overflow-hidden">
                  <MDEditor value={form.curriculum || ''} onChange={(v) => setForm(f => ({...f, curriculum: (v || '').toString()}))} height={120} preview="edit" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Os textos são justificados automaticamente no site. Use Markdown: **negrito**, *itálico*, ~~tachado~~, listas e links. Não use tags HTML.</p>
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
