'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

interface WarningModalProps {
  settings: {
    warning_enabled: boolean
    warning_title?: string
    warning_body?: string
    warning_type?: 'text' | 'video'
    video_url?: string
    phone?: string
    email?: string
    title_align?: 'left'|'center'|'right'
    title_size?: 'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'
    title_color?: string
    body_align?: 'left'|'center'|'right'|'justify'
  } | null
  bannerSettings: {
    id: string
    image_url: string
    link_url?: string
    is_active: boolean
  } | null
}

export default function WarningModal({ settings, bannerSettings }: WarningModalProps) {
  const [showModal, setShowModal] = useState(false)
  const [isAndroidIos, setIsAndroidIos] = useState(false)
  const [mobileStep, setMobileStep] = useState<'warning' | 'banner'>('warning')

  const showWarning = !!settings?.warning_enabled
  const showBanner = !!bannerSettings?.is_active && !!bannerSettings?.image_url
  const twoColumns = showWarning && showBanner

  useEffect(() => {
    setMobileStep(showWarning ? 'warning' : 'banner')
    const shouldOpen = showWarning || showBanner
    if (!shouldOpen) return
    const timer = setTimeout(() => setShowModal(true), 600)
    return () => clearTimeout(timer)
  }, [showWarning, showBanner])

  useEffect(() => {
    if (!showModal) {
      window.dispatchEvent(new CustomEvent('nc-warning-modal', { detail: { open: false } }))
      return
    }
    window.dispatchEvent(new CustomEvent('nc-warning-modal', { detail: { open: true } }))
    return () => {
      window.dispatchEvent(new CustomEvent('nc-warning-modal', { detail: { open: false } }))
    }
  }, [showModal])

  useEffect(() => {
    const ua = (navigator.userAgent || '').toLowerCase()
    const isAndroid = ua.includes('android')
    const isIOS = /iphone|ipad|ipod/.test(ua) || (ua.includes('macintosh') && ua.includes('mobile'))
    setIsAndroidIos(isAndroid || isIOS)
  }, [])

  const closeAll = () => {
    setShowModal(false)
    setMobileStep(showWarning ? 'warning' : 'banner')
  }

  if ((!showWarning && !showBanner) || !showModal) return null

  const title = (settings?.warning_title || 'Atenção!')
  const body = (settings?.warning_body || '')
  const phone = (settings?.phone || '').trim()
  const email = (settings?.email || '').trim()
  const hasPhone = !!phone
  const hasEmail = !!email
  const isVideo = showWarning && settings?.warning_type === 'video' && !!settings?.video_url
  const titleAlign = settings?.title_align || 'left'
  const titleSize = settings?.title_size || 'xl'
  const titleColor = settings?.title_color || '#111827'
  const bodyAlign = settings?.body_align || 'left'
  const titleClass = sizeToClass(titleSize)

  if (isAndroidIos) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/80 overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center p-4">
          {(showWarning && (mobileStep === 'warning' || !showBanner)) && (
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-end p-3 bg-white border-b">
                <button onClick={closeAll} className="text-gray-500 hover:text-gray-700" aria-label="Fechar aviso">
                  <X size={22} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle className="text-red-500" size={32} />
                    </div>
                  </div>

                  <h3
                    className={`${titleClass} font-bold mb-4`}
                    style={{ color: titleColor, textAlign: titleAlign as any }}
                    dangerouslySetInnerHTML={{ __html: md.renderInline(title) }}
                  />

                  {isVideo ? (
                    <div className="mb-6">
                      {/(youtube\.com|youtu\.be)/i.test(settings?.video_url || '') ? (
                        <div className="aspect-video w-full overflow-hidden rounded-lg">
                          <iframe
                            src={toYouTubeEmbed(settings!.video_url!)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <video src={settings!.video_url!} controls className="w-full rounded-lg" />
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-gray-700 mb-6 leading-relaxed space-y-4 [&_a]:text-blue-600 [&_a:hover]:underline [&_strong]:font-semibold"
                      style={{ textAlign: bodyAlign as any }}
                      dangerouslySetInnerHTML={{ __html: md.render(body) }}
                    />
                  )}

                  {(hasPhone || hasEmail) && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      {hasPhone && (
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-blue-600 font-semibold">📞 Telefone:</span>
                          <span className="ml-2 text-blue-800 font-bold">{phone}</span>
                        </div>
                      )}
                      {hasEmail && (
                        <div className="flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">📧 E-mail:</span>
                          <span className="ml-2 text-blue-800 font-bold">{email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 grid grid-cols-1 gap-3">
                {showBanner && (
                  <button
                    onClick={() => setMobileStep('banner')}
                    className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Ver banner
                  </button>
                )}
                <button
                  onClick={closeAll}
                  className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Entendi
                </button>
              </div>
            </div>
          )}

          {(showBanner && (!showWarning || mobileStep === 'banner')) && (
            <div className="w-full max-w-lg flex flex-col items-center">
              <div className="w-full flex items-center justify-end mb-3">
                <button onClick={closeAll} className="bg-white p-2 rounded-full shadow text-gray-600" aria-label="Fechar banner">
                  <X size={22} />
                </button>
              </div>

              <div className="w-full flex items-center justify-center">
                {bannerSettings!.link_url ? (
                  <a href={bannerSettings!.link_url} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <img
                      src={bannerSettings!.image_url}
                      alt="Banner"
                      className="w-full h-full object-contain rounded-lg"
                      style={{ maxHeight: '70vh' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </a>
                ) : (
                  <img
                    src={bannerSettings!.image_url}
                    alt="Banner"
                    className="w-full h-full object-contain rounded-lg"
                    style={{ maxHeight: '70vh' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                )}
              </div>

              <div className="mt-4 w-full grid grid-cols-1 gap-3">
                {showWarning && (
                  <button
                    onClick={() => setMobileStep('warning')}
                    className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Voltar
                  </button>
                )}
                <button
                  onClick={closeAll}
                  className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Entendi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`mx-4 w-full max-w-xl md:max-w-2xl lg:max-w-5xl flex flex-col ${showBanner ? 'md:flex-row md:gap-8 md:items-stretch' : ''} items-center justify-center`}>
        <div className={`bg-white rounded-2xl w-full shadow-2xl relative overflow-hidden flex flex-col ${showBanner ? 'md:flex-[1.2]' : ''} max-h-[90vh]`}>
          <div className="flex items-center justify-end p-3 md:p-4 bg-white/90 backdrop-blur border-b">
            <button
              onClick={closeAll}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fechar aviso"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-5 md:p-8 overflow-y-auto flex-1">
            {showWarning && (
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="text-red-500" size={32} />
                  </div>
                </div>

                <h3
                  className={`${titleClass} font-bold mb-4`}
                  style={{ color: titleColor, textAlign: titleAlign as any }}
                  dangerouslySetInnerHTML={{ __html: md.renderInline(title) }}
                />

                {isVideo ? (
                  <div className="mb-6">
                    {/(youtube\.com|youtu\.be)/i.test(settings?.video_url || '') ? (
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <iframe
                          src={toYouTubeEmbed(settings!.video_url!)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video src={settings!.video_url!} controls className="w-full rounded-lg" />
                    )}
                  </div>
                ) : (
                  <div
                    className="text-gray-700 mb-6 leading-relaxed space-y-4 [&_a]:text-blue-600 [&_a:hover]:underline [&_strong]:font-semibold"
                    style={{ textAlign: bodyAlign as any }}
                    dangerouslySetInnerHTML={{ __html: md.render(body) }}
                  />
                )}

                {(hasPhone || hasEmail) && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    {hasPhone && (
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-blue-600 font-semibold">📞 Telefone:</span>
                        <span className="ml-2 text-blue-800 font-bold">{phone}</span>
                      </div>
                    )}
                    {hasEmail && (
                      <div className="flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">📧 E-mail:</span>
                        <span className="ml-2 text-blue-800 font-bold">{email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-5 md:p-8 pt-0">
            <button
              onClick={closeAll}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>

        {showBanner && (
          <div className={`w-full ${showWarning ? 'mt-6 md:mt-0' : ''} ${showWarning ? 'md:flex-1' : ''} flex items-center justify-center max-h-[90vh]`}>
            {bannerSettings!.link_url ? (
              <a
                href={bannerSettings!.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <img
                  src={bannerSettings!.image_url}
                  alt="Banner"
                  className="w-full h-full object-contain rounded-lg"
                  style={{ maxHeight: '90vh' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </a>
            ) : (
              <img
                src={bannerSettings!.image_url}
                alt="Banner"
                className="w-full h-full object-contain rounded-lg"
                style={{ maxHeight: '90vh' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            )}
          </div>
        )}
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

function sizeToClass(size: 'sm'|'md'|'lg'|'xl'|'2xl'|'3xl') {
  switch (size) {
    case 'sm': return 'text-lg'
    case 'md': return 'text-xl'
    case 'lg': return 'text-2xl'
    case 'xl': return 'text-3xl'
    case '2xl': return 'text-4xl'
    case '3xl': return 'text-5xl'
    default: return 'text-xl'
  }
}
