'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Bot, Send, Loader2, MessageCircle, Paperclip } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import type { ChatMessage, LeadData, ChatApiResponse } from '@/types/assistantTypes'

type Message = {
  id: number
  text: string
  sender: 'user' | 'assistant'
  type: 'text' | 'options'
  options?: string[]
}

export default function AssistantWidget() {
  const EMOJI = {
    person: String.fromCodePoint(0x1F464),
    phone: String.fromCodePoint(0x1F4DE),
    scales: '\u2696\uFE0F',
    memo: String.fromCodePoint(0x1F4DD),
    clip: String.fromCodePoint(0x1F4CE),
  }

  // States
  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<'lgpd' | 'chat' | 'complete'>('lgpd')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [lead, setLead] = useState<Partial<LeadData>>({})
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null)
  const [leadSaved, setLeadSaved] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll
  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  // Reset and close
  const resetAndClose = (delayMs = 0) => {
    const doReset = () => {
      setIsOpen(false)
      setMessages([])
      setLead({})
      setChatHistory([])
      setPhase('lgpd')
      setInputValue('')
      setWhatsappLink(null)
      setLeadSaved(false)
    }
    if (delayMs > 0) setTimeout(doReset, delayMs)
    else doReset()
  }

  // Message helpers
  const addMsg = (text: string, sender: 'user' | 'assistant', type: Message['type'] = 'text', extra?: Partial<Message>) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, sender, type, ...extra }])
  }

  const computeDelay = (t: string) => Math.min(1800, Math.max(300, Math.floor(t.length * 10)))

  const addAssistant = (text: string, type: Message['type'] = 'text', extra?: Partial<Message>) => {
    const delay = computeDelay(text)
    setIsTyping(true)
    setTimeout(() => {
      addMsg(text, 'assistant', type, extra)
      setIsTyping(false)
    }, delay)
  }

  const addAssistantImmediate = (text: string, type: Message['type'] = 'text', extra?: Partial<Message>) => {
    addMsg(text, 'assistant', type, extra)
  }

  const showOptionsAfter = (previousText: string, options: string[]) => {
    const d = computeDelay(previousText) + 200
    setTimeout(() => {
      addMsg('', 'assistant', 'options', { options })
    }, d)
  }

  const addUser = (text: string) => addMsg(text, 'user')

  // Open handler
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addAssistant('Olá! 😊 Sou o assistente virtual da Neves & Costa! Estou aqui para te ajudar a organizar suas informações e te encaminhar ao advogado certo. Vamos começar?')
      const consentText = 'Antes de começarmos, preciso do seu consentimento para usar seus dados apenas para fins de atendimento jurídico. Isso nos ajuda a seguir a Lei LGPD e proteger suas informações.'
      addAssistant(consentText)
      showOptionsAfter(consentText, ['✅ Sim, concordo!', '❌ Não, quero mais informações'])
    }
  }, [isOpen])

  // WhatsApp link helper
  const waLink = (text: string) => {
    const normalized = text.normalize('NFC')
    return `https://wa.me/557391225215?text=${encodeURIComponent(normalized)}`
  }

  // File upload
  const uploadPublic = async (file: File) => {
    try {
      setUploadStatus('uploading')
      const ext = file.name.split('.').pop()
      const name = `${Math.random().toString(36).slice(2)}_${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('assistant-uploads').upload(name, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('assistant-uploads').getPublicUrl(name)
      setUploadStatus('success')
      return publicUrl as string
    } catch (e) {
      console.error(e)
      setUploadStatus('error')
      return ''
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadPublic(file)
    if (url) {
      setLead(prev => ({ ...prev, arquivo: url }))
      addUser(`Arquivo anexado: ${file.name}`)
      // OCR for images
      if (file.type.startsWith('image/')) {
        try {
          setIsTyping(true)
          const loadTesseract = async (): Promise<any> => {
            try {
              const mod = await import('tesseract.js')
              return mod.default || (mod as any)
            } catch (err) {
              await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script')
                s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'
                s.async = true
                s.onload = () => resolve()
                s.onerror = () => reject(new Error('CDN load failed'))
                document.body.appendChild(s)
              })
              return (window as any).Tesseract
            }
          }
          const Tesseract = await loadTesseract()
          const { data } = await Tesseract.recognize(file, 'por')
          const texto = (data?.text || '').trim()
          if (texto) {
            setLead(prev => ({ ...prev, resumo: prev.resumo ? `${prev.resumo}\n${texto}` : texto }))
            addAssistantImmediate('📄 Transcrição do arquivo adicionada ao seu caso. Pode continuar descrevendo sua situação!')
          } else {
            addAssistantImmediate('📎 Arquivo anexado com sucesso! Não foi possível extrair texto da imagem, mas ele será enviado junto.')
          }
        } catch (err) {
          console.warn('OCR indisponível:', err)
          addAssistantImmediate('📎 Arquivo anexado! A transcrição automática está indisponível no momento.')
        } finally {
          setIsTyping(false)
        }
      } else {
        addAssistantImmediate('📎 Arquivo anexado com sucesso!')
      }
    } else {
      addAssistantImmediate('Não foi possível enviar o arquivo. Tente novamente.')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Send message to AI
  const sendToAI = async (userMessage: string) => {
    if (isSending) return
    setIsSending(true)
    setIsTyping(true)

    // Add user message to history
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: userMessage }]

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          userMessage,
          leadData: lead,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Erro na comunicação')
      }

      const data: ChatApiResponse = await res.json()

      // Update history with AI response
      const updatedHistory: ChatMessage[] = [...newHistory, { role: 'model', text: data.reply }]
      setChatHistory(updatedHistory)

      // Update lead data
      if (data.leadData) {
        setLead(data.leadData)
      }

      // Show AI reply
      addAssistantImmediate(data.reply)

      // Check if lead is complete
      if (data.leadComplete && data.whatsappLink) {
        setWhatsappLink(data.whatsappLink)
        setLeadSaved(!!data.leadSaved)
        setPhase('complete')

        // Show summary after a delay
        setTimeout(() => {
          const ld = data.leadData!
          const resumo =
            `📋 Resumo do Atendimento\n\n` +
            `👤 Nome: ${ld.nome}\n` +
            `📞 WhatsApp: ${ld.whatsapp}\n` +
            `⚖️ Área: ${ld.area}\n` +
            `📝 Resumo: ${ld.resumo || '(não informado)'}\n` +
            (ld.arquivo ? `📎 Arquivo: ${ld.arquivo}\n` : '')
          addMsg(resumo, 'assistant', 'text')

          setTimeout(() => {
            addMsg('', 'assistant', 'options', {
              options: ['📲 Enviar para WhatsApp', '✏️ Continuar conversando']
            })
          }, 800)
        }, 1200)
      }
    } catch (err: any) {
      console.error('Erro ao enviar para IA:', err)
      const errorMsg = err.message && err.message !== 'Erro na comunicação'
        ? err.message
        : 'Desculpe, tive um probleminha técnico. 😅 Pode tentar enviar novamente?'
      addAssistantImmediate(errorMsg)
    } finally {
      setIsTyping(false)
      setIsSending(false)
    }
  }

  // Handle LGPD option click
  const onLgpdOption = (option: string) => {
    addUser(option)
    if (option.startsWith('✅')) {
      // Consent given, start AI chat
      setPhase('chat')
      setTimeout(() => {
        addAssistant('Ótimo! 🎉 Agora me conte: como posso te ajudar? Pode descrever sua situação, fazer perguntas sobre nossas áreas de atuação, ou simplesmente dizer o que precisa.')
      }, 400)
    } else if (option === 'Sim, quero continuar') {
      setPhase('chat')
      setTimeout(() => {
        addAssistant('Perfeito! 🎉 Me conte: como posso te ajudar?')
      }, 400)
    } else if (option === 'Não, obrigado' || option === 'Entendi') {
      addAssistant('Obrigado! Encerrando a conversa...')
      resetAndClose(1500)
    } else {
      // More info about LGPD
      const info = '🧾 Autorização para Uso de Dados – Escritório Jurídico\nAo entrar em contato com um escritório jurídico, é comum que sejam solicitados alguns dados pessoais, como nome, telefone, CPF e informações sobre o caso. Esses dados são necessários para que o advogado possa compreender a situação, prestar o atendimento adequado e, se necessário, representar o cliente judicial ou extrajudicialmente.\nA autorização para o uso desses dados é importante para garantir transparência e segurança, conforme a Lei Geral de Proteção de Dados (LGPD). O escritório utilizará as informações apenas para fins jurídicos, administrativos e de contato, sempre com confidencialidade e respeito à privacidade do cliente.\nEm resumo, o fornecimento e a autorização de uso dos dados servem para viabilizar o atendimento jurídico de forma responsável, segura e dentro da lei.'
      addAssistant(info)
      showOptionsAfter(info, ['Sim, quero continuar', 'Não, obrigado'])
    }
  }

  // Handle complete phase option click
  const onCompleteOption = (option: string) => {
    addUser(option)
    if (option === '📲 Enviar para WhatsApp') {
      if (whatsappLink) {
        window.open(whatsappLink, '_blank')
      } else {
        // Fallback: send lead summary to WhatsApp
        const summary = `Olá! Gostaria de atendimento com a Advocacia Neves Costa. Meu caso: ${lead.resumo || 'Não informado'}`
        window.open(waLink(summary), '_blank')
      }
      addAssistant('Obrigado pelo contato! 🙏 Sua mensagem foi redirecionada. Entraremos em contato o mais breve possível!')
      resetAndClose(2500)
    } else if (option === '✏️ Continuar conversando') {
      // Return to chat phase without closing widget or losing history
      setPhase('chat')
      addAssistantImmediate('Claro! Pode continuar me contando o que aconteceu.')
    }
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending) return

    const msg = inputValue.trim()
    addUser(msg)
    setInputValue('')

    if (phase === 'lgpd') {
      // User typed something during LGPD, treat as consent
      onLgpdOption('✅ Sim, concordo!')
    } else if (phase === 'chat') {
      sendToAI(msg)
    }
  }

  // Handle option click (routes to correct handler)
  const onOption = (option: string) => {
    if (phase === 'lgpd') {
      onLgpdOption(option)
    } else if (phase === 'complete') {
      onCompleteOption(option)
    }
  }

  // Parse Markdown safely (bold only)
  const parseMarkdown = (text: string) => {
    const boldRegex = /\*\*(.+?)\*\*/g

    // Find all **bold** matches
    let match
    const boldMatches: Array<{ start: number; end: number; text: string }> = []
    while ((match = boldRegex.exec(text)) !== null) {
      boldMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1] })
    }

    // Build result with bold markers
    let result = text
    boldMatches.reverse().forEach(m => {
      result = result.slice(0, m.start) + '\x00BOLD_START\x00' + m.text + '\x00BOLD_END\x00' + result.slice(m.end)
    })

    // Split by markers and build JSX
    const segments = result.split(/(\x00BOLD_START\x00|\x00BOLD_END\x00)/)
    let isBold = false
    const parsed: React.ReactNode[] = []
    let segmentIndex = 0

    for (const segment of segments) {
      if (segment === '\x00BOLD_START\x00') {
        isBold = true
      } else if (segment === '\x00BOLD_END\x00') {
        isBold = false
      } else if (segment) {
        if (isBold) {
          parsed.push(<strong key={`bold-${segmentIndex}`}>{segment}</strong>)
        } else {
          parsed.push(segment)
        }
        segmentIndex++
      }
    }

    return parsed.length > 0 ? parsed : text
  }

  // Render message
  const renderMessage = (m: Message) => {
    const isUser = m.sender === 'user'
    if (m.type === 'options' && m.options) {
      return (
        <div className="flex justify-start mb-4">
          <div className="max-w-[80%] bg-white p-3 rounded-2xl shadow-sm">
            {m.text && <p className="text-gray-800 mb-2">{parseMarkdown(m.text)}</p>}
            <div className="flex flex-wrap gap-2">
              {m.options.map((op, i) => (
                <button key={i} onClick={() => onOption(op)} className="px-3 py-1.5 bg-yellow-50 text-yellow-800 rounded-full text-sm hover:bg-yellow-100 border border-yellow-200 transition-colors">
                  {op}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'bg-yellow-500 text-black' : 'bg-white text-gray-800'} p-3 rounded-2xl shadow-sm`}>
          {m.text.split('\n').map((line, i) => (<p key={i} className={i > 0 ? 'mt-1' : ''}>{parseMarkdown(line)}</p>))}
        </div>
      </div>
    )
  }

  // Widget closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <div className="relative group">
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
            <div className="bg-white text-gray-900 px-4 py-2 rounded-2xl shadow-lg border border-gray-200 relative">
              <p className="text-sm font-medium">Posso ajudar? 😊</p>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200"></div>
            </div>
          </div>
          <button onClick={() => setIsOpen(true)} className="relative hover:scale-110 transition-all duration-300 animate-float" aria-label="Abrir Assistente N&C" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <img src="/Assistente N&C.png" alt="Assistente N&C" className="w-20 h-20 cursor-pointer drop-shadow-lg hover:drop-shadow-xl transition-all duration-300" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </button>
        </div>
        <style jsx>{`
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .animate-float { animation: float 3s ease-in-out infinite; }
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.3s ease-out; }
        `}</style>
      </div>
    )
  }

  // Widget open
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-black to-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot size={24} className="animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h2 className="font-bold text-lg">Assistente</h2>
          <img src="/Logo transparente.png" alt="Logo N&C" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => resetAndClose()} className="text-white hover:bg-gray-800 p-2 rounded-lg" title="Fechar e reiniciar">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-2">{renderMessage(m)}</div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[60%] bg-white p-3 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '120ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '240ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-gray-200 p-3 bg-white">
        {leadSaved && phase === 'complete' && (
          <div className="mb-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-full text-center border border-green-200">
            ✅ Suas informações foram salvas com segurança
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={phase === 'chat' ? 'Descreva seu caso ou faça uma pergunta...' : 'Digite sua mensagem...'}
              className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isSending}
            />
            {/* File attachment button */}
            <input id="file-input-inline" ref={fileInputRef} type="file" onChange={handleFileUpload} accept="image/*,application/pdf,audio/*" className="hidden" />
            {phase === 'chat' && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600"
                title="Anexar arquivo"
              >
                <Paperclip size={20} />
              </button>
            )}
          </div>
          <button type="submit" className="p-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-600 disabled:opacity-50" disabled={isSending}>
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  )
}
