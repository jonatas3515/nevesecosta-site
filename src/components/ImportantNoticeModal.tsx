'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

export default function ImportantNoticeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Mostrar modal sempre que o site for aberto
    setIsOpen(true)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl mx-4 p-8 relative">
        {/* Botão Fechar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fechar aviso"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Ícone de Alerta */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-600" size={48} />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Atenção!
        </h2>

        {/* Conteúdo */}
        <div className="text-gray-700 leading-relaxed space-y-4">
          <p>
            A <strong>Neves & Costa</strong> informa que <strong>não envia mensagens por celular</strong>, 
            em nome de seus advogados para tratar de ordens de pagamentos de processos ou de custas 
            judiciais e também <strong>não faz nenhum tipo de cobrança</strong> e nem emite boletos.
          </p>
          
          <p>
            Em caso de dúvida ou de recebimento de mensagens suspeitas entre, imediatamente, em contato:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">📞 Telefone:</span>
                <a 
                  href="tel:+5573999348552" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  (73) 9 9934-8552
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">✉️ E-mail:</span>
                <a 
                  href="mailto:contato@nevesecosta.com.br" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  contato@nevesecosta.com.br
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Entendi */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  )
}
