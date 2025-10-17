"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    warning_enabled: false,
    warning_title: 'Atenção! ',
    warning_body: '',
    warning_type: 'text' as 'text' | 'video',
    video_url: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'default')
          .maybeSingle()
        if (!mounted) return
        if (data) {
          setForm({
            warning_enabled: !!data.warning_enabled,
            warning_title: data.warning_title || 'Atenção!',
            warning_body: data.warning_body || '',
            warning_type: (data.warning_type as 'text' | 'video') || 'text',
            video_url: data.video_url || '',
            phone: data.phone || '',
            email: data.email || '',
          })
        }
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const payload = { ...form, updated_at: new Date().toISOString() }
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'default', ...payload }, { onConflict: 'id' })
      if (error) throw error
      alert('Configurações salvas!')
    } catch (e: any) {
      alert('Erro ao salvar: ' + (e?.message || String(e)))
    } finally { setSaving(false) }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gold-500 mb-6">Configurações do Site</h2>

      {/* Aviso da Home */}
      <div className="bg-gray-900 rounded-xl border border-gold-500/20 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Aviso na Página Inicial</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 text-gray-200">
            <input type="checkbox" checked={form.warning_enabled} onChange={(e)=>setForm({...form, warning_enabled: e.target.checked})} />
            Habilitar aviso
          </label>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Tipo de conteúdo</label>
            <select
              value={form.warning_type}
              onChange={(e)=>setForm({...form, warning_type: e.target.value as 'text' | 'video'})}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
            >
              <option value="text">Texto</option>
              <option value="video">Vídeo</option>
            </select>
          </div>

          {form.warning_type === 'text' ? (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Título</label>
                <input
                  value={form.warning_title}
                  onChange={(e)=>setForm({...form, warning_title: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Mensagem</label>
                <textarea
                  value={form.warning_body}
                  onChange={(e)=>setForm({...form, warning_body: e.target.value})}
                  rows={5}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm text-gray-300 mb-1">URL do Vídeo (YouTube ou arquivo .mp4)</label>
              <input
                value={form.video_url}
                onChange={(e)=>setForm({...form, video_url: e.target.value})}
                placeholder="https://www.youtube.com/watch?v=... ou https://.../video.mp4"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
              />
            </div>
          )}
        </div>
      </div>

      {/* Contatos */}
      <div className="bg-gray-900 rounded-xl border border-gold-500/20 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Contato</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Telefone</label>
            <input
              value={form.phone}
              onChange={(e)=>setForm({...form, phone: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">E-mail</label>
            <input
              value={form.email}
              onChange={(e)=>setForm({...form, email: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  )
}
