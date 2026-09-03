'use client'

import { useEffect, useMemo, useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import { getSiteContent } from '@/lib/siteContent'

type ContactSubjectOption = { value: string; label: string }

type HomeContactData = {
  header_title?: string
  header_subtitle?: string
  info_title?: string

  location_title?: string
  location_lines?: string[]

  phone_title?: string
  phone_lines?: string[]

  email_title?: string
  email_lines?: string[]

  hours_title?: string
  hours_lines?: string[]

  infobox_title?: string
  infobox_body?: string
  infobox_list_title?: string
  infobox_list_items?: string[]
  infobox_quote?: string

  form_title?: string
  submit_button_label?: string
  success_title?: string
  success_message?: string

  name_label?: string
  name_placeholder?: string
  email_label?: string
  email_placeholder?: string
  phone_label?: string
  phone_placeholder?: string
  subject_label?: string
  subject_placeholder?: string
  message_label?: string
  message_placeholder?: string

  subject_options?: ContactSubjectOption[]

  whatsapp_phone?: string
  to_email?: string
}

const defaultContact: Required<HomeContactData> = {
  header_title: 'Entre em Contato',
  header_subtitle: 'Estamos prontos para atender você. Agende uma consulta gratuita!',
  info_title: 'Informações de Contato',

  location_title: 'Localização',
  location_lines: ['Extremo Sul da Bahia', 'Atendimento 100% Digital', 'Atuação em todo o Brasil'],

  phone_title: 'Telefone / WhatsApp',
  phone_lines: ['(73) 9122-5215', '(73) 98862-0915'],

  email_title: 'E-mail',
  email_lines: ['nevesecosta.esc@gmail.com', 'contato@nevesecosta.com.br'],

  hours_title: 'Horário de Atendimento',
  hours_lines: ['Segunda a Sexta: 8h às 18h', 'Atendimento Online', 'Resposta rápida via WhatsApp'],

  infobox_title: '📍 Atendimento 100% Digital',
  infobox_body: 'Nosso escritório atua de forma totalmente online, permitindo que você seja atendido com segurança e agilidade, independentemente de onde esteja.',
  infobox_list_title: '⚡ Atuação nos Tribunais:',
  infobox_list_items: ['Bahia (TJ-BA e TRT-5)', 'Espírito Santo', 'Minas Gerais', 'São Paulo', 'Rio de Janeiro'],
  infobox_quote: '"Do seu direito, a gente cuida."',

  form_title: 'Envie uma Mensagem',
  submit_button_label: 'Enviar Mensagem',
  success_title: 'Mensagem Enviada!',
  success_message: 'Obrigado pelo contato. Retornaremos em breve!',

  name_label: 'Nome Completo *',
  name_placeholder: 'Seu nome',
  email_label: 'E-mail *',
  email_placeholder: 'seu@email.com',
  phone_label: 'Telefone *',
  phone_placeholder: '(11) 12345-6789',
  subject_label: 'Assunto *',
  subject_placeholder: 'Selecione uma área',
  message_label: 'Mensagem *',
  message_placeholder: 'Descreva sua situação...',

  subject_options: [
    { value: 'trabalhista', label: 'Direito Trabalhista' },
    { value: 'familia', label: 'Direito de Família' },
    { value: 'imobiliario', label: 'Direito Imobiliário' },
    { value: 'empresarial', label: 'Direito Empresarial' },
    { value: 'civil', label: 'Direito Civil' },
    { value: 'previdenciario', label: 'Direito Previdenciário' },
    { value: 'tributario', label: 'Direito Tributário' },
    { value: 'consumidor', label: 'Direito do Consumidor' },
    { value: 'outro', label: 'Outro' },
  ],

  whatsapp_phone: '557391225215',
  to_email: 'contato@nevesecosta.com.br',
}

export default function Contact() {
  const [content, setContent] = useState<HomeContactData>(defaultContact)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await getSiteContent<HomeContactData>('home.contact')
      if (!mounted || !data) return

      setContent((p) => ({
        ...p,
        ...data,
        location_lines: Array.isArray(data.location_lines) ? data.location_lines : p.location_lines,
        phone_lines: Array.isArray(data.phone_lines) ? data.phone_lines : p.phone_lines,
        email_lines: Array.isArray(data.email_lines) ? data.email_lines : p.email_lines,
        hours_lines: Array.isArray(data.hours_lines) ? data.hours_lines : p.hours_lines,
        infobox_list_items: Array.isArray(data.infobox_list_items) ? data.infobox_list_items : p.infobox_list_items,
        subject_options: Array.isArray(data.subject_options) ? data.subject_options : p.subject_options,
      }))
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const subjectLabel = useMemo(() => {
    const opt = (content.subject_options || defaultContact.subject_options).find((o) => o.value === formData.subject)
    return opt?.label || formData.subject
  }, [content.subject_options, formData.subject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Enviar email usando EmailJS
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_nevescosta',
          template_id: 'template_contato',
          user_id: 'neves_costa_public_key',
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            subject: subjectLabel,
            message: formData.message,
            to_email: (content.to_email || defaultContact.to_email),
          }
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        }, 3000)
      } else {
        throw new Error('Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      // Fallback: redirecionar para WhatsApp
      const whatsappMessage = `
Olá! Vim do site e gostaria de falar sobre:

*Nome:* ${formData.name}
*Email:* ${formData.email}
*Telefone:* ${formData.phone}
*Assunto:* ${subjectLabel}

*Mensagem:*
${formData.message}
      `.trim()
      
      const phoneDigits = String(content.whatsapp_phone || defaultContact.whatsapp_phone).replace(/\D/g, '')
      const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, '_blank')
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      }, 3000)
    }
  }

  return (
    <section id="contato" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.header_title || defaultContact.header_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.header_subtitle || defaultContact.header_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {content.info_title || defaultContact.info_title}
              </h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <MapPin className="text-[#fbbf24]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{content.location_title || defaultContact.location_title}</h4>
                    <p className="text-gray-600">
                      {(content.location_lines || defaultContact.location_lines).map((ln, idx) => (
                        <span key={idx}>
                          {ln}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Phone className="text-[#fbbf24]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{content.phone_title || defaultContact.phone_title}</h4>
                    <p className="text-gray-600">
                      {(content.phone_lines || defaultContact.phone_lines).map((ln, idx) => (
                        <span key={idx}>
                          {ln}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Mail className="text-[#fbbf24]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{content.email_title || defaultContact.email_title}</h4>
                    <p className="text-gray-600">
                      {(content.email_lines || defaultContact.email_lines).map((ln, idx) => (
                        <span key={idx}>
                          {ln}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Clock className="text-[#fbbf24]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{content.hours_title || defaultContact.hours_title}</h4>
                    <p className="text-gray-600">
                      {(content.hours_lines || defaultContact.hours_lines).map((ln, idx) => (
                        <span key={idx}>
                          {ln}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-brown-50 to-gold-50 rounded-lg p-6 border-2 border-gold-200">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {content.infobox_title || defaultContact.infobox_title}
                </h4>
                <p className="text-gray-700 mb-4">
                  {content.infobox_body || defaultContact.infobox_body}
                </p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="font-semibold text-gray-900 mb-2">{content.infobox_list_title || defaultContact.infobox_list_title}</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {(content.infobox_list_items || defaultContact.infobox_list_items).map((it, idx) => (
                      <li key={idx}>• {it}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-brown-700 font-semibold italic">
                  {content.infobox_quote || defaultContact.infobox_quote}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {content.form_title || defaultContact.form_title}
                </h3>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-green-600 mb-2">
                      <Send className="mx-auto mb-2" size={48} />
                    </div>
                    <h4 className="text-xl font-bold text-green-900 mb-2">
                      {content.success_title || defaultContact.success_title}
                    </h4>
                    <p className="text-green-700">
                      {content.success_message || defaultContact.success_message}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulário de contato">
                    <div>
                      <label htmlFor="contact-name" className="block text-gray-700 font-medium mb-2">
                        {content.name_label || defaultContact.name_label}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={content.name_placeholder || defaultContact.name_placeholder}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-gray-700 font-medium mb-2">
                        {content.email_label || defaultContact.email_label}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={content.email_placeholder || defaultContact.email_placeholder}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-gray-700 font-medium mb-2">
                        {content.phone_label || defaultContact.phone_label}
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={content.phone_placeholder || defaultContact.phone_placeholder}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-gray-700 font-medium mb-2">
                        {content.subject_label || defaultContact.subject_label}
                      </label>
                      <select
                        id="contact-subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">{content.subject_placeholder || defaultContact.subject_placeholder}</option>
                        {(content.subject_options || defaultContact.subject_options).map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-gray-700 font-medium mb-2">
                        {content.message_label || defaultContact.message_label}
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder={content.message_placeholder || defaultContact.message_placeholder}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold-500 text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-gold-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>{content.submit_button_label || defaultContact.submit_button_label}</span>
                      <Send size={20} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
