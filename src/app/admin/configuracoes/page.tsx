"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [form, setForm] = useState({
    warning_enabled: false,
    warning_title: 'Atenção! ',
    warning_body: '',
    warning_type: 'text' as 'text' | 'video',
    video_url: '',
    phone: '',
    email: '',
  })
  const [current, setCurrent] = useState<typeof form | null>(null)

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
          setCurrent({
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

function PreviewOverlay({ data, onClose }: { data: { warning_enabled: boolean; warning_title: string; warning_body: string; warning_type: 'text'|'video'; video_url?: string; phone?: string; email?: string }, onClose: ()=>void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>
        <PreviewCard data={data} />
      </div>
    </div>
  )
}

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gold-500 mb-6">Configurações do Site</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-gray-900 rounded-xl border border-gold-500/20 p-6">
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
              <div className="space-y-3">
                <label className="block text-sm text-gray-300 mb-1">URL do Vídeo (YouTube ou arquivo .mp4)</label>
                <input
                  value={form.video_url}
                  onChange={(e)=>setForm({...form, video_url: e.target.value})}
                  placeholder="https://www.youtube.com/watch?v=... ou https://.../video.mp4"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploadingVideo(true)
                      try {
                        const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9_.-]/g,'_')}`
                        const path = `warnings/${name}`
                        const { error: upErr } = await supabase.storage.from('site-media').upload(path, file, { upsert: false, cacheControl: '3600' })
                        if (upErr) { alert('Falha no upload: ' + upErr.message); return }
                        const { data: pub } = supabase.storage.from('site-media').getPublicUrl(path)
                        const url = pub.publicUrl
                        setForm({ ...form, video_url: url })
                      } catch (e:any) {
                        alert('Erro ao enviar vídeo: ' + (e?.message || String(e)))
                      } finally { setUploadingVideo(false) }
                    }}
                    className="text-sm file:mr-3 file:px-3 file:py-2 file:rounded-md file:border-0 file:bg-gray-700 file:text-gray-100 file:hover:bg-gray-600"
                  />
                  <span className="text-sm text-gray-400">{uploadingVideo ? 'Enviando...' : 'ou cole uma URL acima'}</span>
                </div>
              </div>
            )}

            {/* Contatos */}
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

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2 rounded-md border border-gold-500/40 text-gold-400 hover:bg-gray-700"
              >
                Visualizar como modal
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gold-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Aviso atual (salvo)</h3>
            {current?.warning_enabled ? (
              <PreviewCard data={current} />
            ) : (
              <p className="text-gray-400">Nenhum aviso habilitado.</p>
            )}
          </div>
          <div className="bg-gray-900 rounded-xl border border-gold-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Prévia (não salva)</h3>
            {form.warning_enabled ? (
              <PreviewCard data={form} />
            ) : (
              <p className="text-gray-400">Desabilitado. Marque "Habilitar aviso" para visualizar a prévia.</p>
            )}
          </div>
        </div>
      </div>
      {showPreviewModal && (
        <PreviewOverlay data={form} onClose={() => setShowPreviewModal(false)} />
      )}
    </div>
  )
}

function PreviewCard({ data }: { data: { warning_enabled: boolean; warning_title: string; warning_body: string; warning_type: 'text'|'video'; video_url?: string; phone?: string; email?: string } }) {
  const title = data.warning_title || 'Atenção!'
  const body = data.warning_body || ''
  const phone = data.phone || '(73) 99934-8552'
  const email = data.email || 'contato@nevesecosta.com.br'
  const isVideo = data.warning_type === 'video' && !!data.video_url
  return (
    <div className="bg-white rounded-xl p-5 text-gray-900">
      <h4 className="text-lg font-bold mb-3">{title}</h4>
      {isVideo ? (
        <div className="mb-4">
          {/youtube\.com|youtu\.be/i.test(data.video_url || '') ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={toYouTubeEmbed(data.video_url!)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video src={data.video_url!} controls className="w-full rounded-lg" />
          )}
        </div>
      ) : (
        <p className="mb-4 leading-relaxed">{body}</p>
      )}
      <div className="bg-blue-50 p-3 rounded">
        <div className="flex items-center gap-2"><span className="font-semibold">📞 Telefone:</span><span className="font-bold">{phone}</span></div>
        <div className="flex items-center gap-2"><span className="font-semibold">📧 E-mail:</span><span className="font-bold">{email}</span></div>
      </div>
    </div>
  )
}

function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '')
      return `https://www.youtube.com/embed/${id}`
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
  } catch {}
  return url
}
