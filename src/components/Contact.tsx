'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

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
            subject: formData.subject,
            message: formData.message,
            to_email: 'contato@nevesecosta.com.br',
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
*Assunto:* ${formData.subject}

*Mensagem:*
${formData.message}
      `.trim()
      
      const whatsappUrl = `https://wa.me/557391225215?text=${encodeURIComponent(whatsappMessage)}`
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
              Entre em Contato
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos prontos para atender você. Agende uma consulta gratuita!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informações de Contato
              </h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <MapPin className="text-[#fbbf24]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Localização</h4>
                    <p className="text-gray-600">
                      Extremo Sul da Bahia<br />
                      Atendimento 100% Digital<br />
                      Atuação em todo o Brasil
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Phone className="text-[#fbbf24]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Telefone / WhatsApp</h4>
                    <p className="text-gray-600">
                      (73) 9122-5215
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Mail className="text-[#fbbf24]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">E-mail</h4>
                    <p className="text-gray-600">
                      nevesecosta.esc@gmail.com<br />
                      contato@nevesecosta.com.br
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Clock className="text-[#fbbf24]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Horário de Atendimento</h4>
                    <p className="text-gray-600">
                      Segunda a Sexta: 8h às 18h<br />
                      Atendimento Online<br />
                      Resposta rápida via WhatsApp
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-brown-50 to-gold-50 rounded-lg p-6 border-2 border-gold-200">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  📍 Atendimento 100% Digital
                </h4>
                <p className="text-gray-700 mb-4">
                  Nosso escritório atua de forma totalmente online, permitindo que você seja atendido 
                  com segurança e agilidade, independentemente de onde esteja.
                </p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="font-semibold text-gray-900 mb-2">⚡ Atuação nos Tribunais:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bahia (TJ-BA e TRT-5)</li>
                    <li>• Espírito Santo</li>
                    <li>• Minas Gerais</li>
                    <li>• São Paulo</li>
                    <li>• Rio de Janeiro</li>
                  </ul>
                </div>
                <p className="text-brown-700 font-semibold italic">
                  "Do seu direito, a gente cuida."
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Envie uma Mensagem
                </h3>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-green-600 mb-2">
                      <Send className="mx-auto mb-2" size={48} />
                    </div>
                    <h4 className="text-xl font-bold text-green-900 mb-2">
                      Mensagem Enviada!
                    </h4>
                    <p className="text-green-700">
                      Obrigado pelo contato. Retornaremos em breve!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="(11) 12345-6789"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Assunto *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Selecione uma área</option>
                        <option value="trabalhista">Direito Trabalhista</option>
                        <option value="familia">Direito de Família</option>
                        <option value="imobiliario">Direito Imobiliário</option>
                        <option value="empresarial">Direito Empresarial</option>
                        <option value="civil">Direito Civil</option>
                        <option value="previdenciario">Direito Previdenciário</option>
                        <option value="tributario">Direito Tributário</option>
                        <option value="consumidor">Direito do Consumidor</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Descreva sua situação..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold-500 text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-gold-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Enviar Mensagem</span>
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
