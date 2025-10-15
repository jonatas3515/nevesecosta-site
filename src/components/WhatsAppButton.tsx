'use client'

import Image from 'next/image'

export default function WhatsAppButton() {
  const phoneNumber = '5573999348552' // Formato internacional sem espaços
  const message = 'Olá! Gostaria de falar com um advogado.'

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 transition-all duration-300 hover:scale-110 group"
      aria-label="Fale conosco no WhatsApp"
    >
      <Image
        src="/whatsapp-logo.webp"
        alt="WhatsApp"
        width={70}
        height={70}
        className="drop-shadow-2xl group-hover:drop-shadow-[0_0_15px_rgba(37,211,102,0.5)]"
      />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Fale conosco!
      </span>
    </button>
  )
}
