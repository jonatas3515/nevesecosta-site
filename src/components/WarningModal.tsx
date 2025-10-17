'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function WarningModal() {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<{
    warning_enabled: boolean
    warning_title?: string
    warning_body?: string
    warning_type?: 'text' | 'video'
    video_url?: string
    phone?: string
    email?: string
  } | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('warning_enabled, warning_title, warning_body, warning_type, video_url, phone, email')
          .eq('id', 'default')
          .maybeSingle()
        if (!mounted) return
        setSettings((data as any) || null)
        // Exibir após pequeno delay somente se estiver habilitado
        if (data?.warning_enabled) {
          setTimeout(() => mounted && setShowModal(true), 600)
        }
      } catch {
        // fallback: não mostrar
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading || !settings?.warning_enabled || !showModal) return null
  const title = settings.warning_title || 'Atenção!'
  const body = settings.warning_body || ''
  const phone = settings.phone || '(73) 99934-8552'
  const email = settings.email || 'contato@nevesecosta.com.br'
  const isVideo = settings.warning_type === 'video' && !!settings.video_url

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
          
          {isVideo ? (
            <div className="mb-6">
              {/* Se for YouTube, incorporar via iframe; caso contrário, usar <video> */}
              {/(youtube\.com|youtu\.be)/i.test(settings.video_url || '') ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    src={toYouTubeEmbed(settings.video_url!)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video src={settings.video_url!} controls className="w-full rounded-lg" />
              )}
            </div>
          ) : (
            <p className="text-gray-700 mb-6 leading-relaxed text-left">{body}</p>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-2">
              <span className="text-blue-600 font-semibold">📞 Telefone:</span>
              <span className="ml-2 text-blue-800 font-bold">{phone}</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-blue-600 font-semibold">📧 E-mail:</span>
              <span className="ml-2 text-blue-800 font-bold">{email}</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Entendi
          </button>
        </div>
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
