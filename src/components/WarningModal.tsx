'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function WarningModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Mostrar modal após um pequeno delay para garantir que a página carregou
    const timer = setTimeout(() => {
      setShowModal(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!showModal) return null

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
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Atenção!
          </h3>
          
          <p className="text-gray-700 mb-4 leading-relaxed text-left">
            A <strong>Neves & Costa</strong> informa que <strong>não envia mensagens por celular</strong>, em nome de 
            seus advogados para tratar de ordens de pagamentos de processos ou de custas 
            judiciais e <strong>não faz nenhum tipo de cobrança</strong> através de boletos.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed text-left">
            Em caso de dúvida ou de recebimento de mensagens suspeitas entre, 
            imediatamente, em contato:
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-2">
              <span className="text-blue-600 font-semibold">📞 Telefone:</span>
              <span className="ml-2 text-blue-800 font-bold">(73) 9 9934-8552</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-blue-600 font-semibold">📧 E-mail:</span>
              <span className="ml-2 text-blue-800 font-bold">contato@nevesecosta.com.br</span>
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
