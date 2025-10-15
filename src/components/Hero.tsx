import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Award } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Badge Centralizado */}
          <div className="flex justify-center mb-0">
            <div className="inline-flex items-center space-x-3 bg-[#fbbf24]/20 backdrop-blur-sm px-6 py-3 rounded-full border border-[#fbbf24]/30">
              <Award className="text-[#fbbf24]" size={20} />
              <span className="text-white font-medium text-base">Advocacia 100% Digital desde 2021</span>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-4 items-center min-h-[50vh] -mt-4">
            {/* Logo Transparente - Ocupa 3 colunas */}
            <div className="md:col-span-3 flex justify-center md:justify-start">
              <Image
                src="/Logo transparente.png"
                alt="Neves & Costa Logo"
                width={800}
                height={800}
                className="w-full max-w-2xl h-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* Conteúdo - Ocupa 2 colunas */}
            <div className="md:col-span-2 text-center md:text-left">

              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Do Seu Direito,
                <span className="block text-[#fbbf24]">A Gente Cuida</span>
              </h1>

              <p className="text-base md:text-lg text-gray-200 mb-8">
                Do Extremo Sul da Bahia para todo o Brasil. Advocacia 100% digital com segurança, clareza e dedicação.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 mb-8">
                <Link
                  href="#contato"
                  className="inline-flex items-center justify-center bg-[#fbbf24] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-all"
                >
                  Agende uma Consulta
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/#areas"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/30"
                >
                  Nossas Especialidades
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/calculadora"
                  className="inline-flex items-center justify-center bg-[#fbbf24] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-all"
                >
                  Calcule sua Rescisão Aqui
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </div>

            </div>
          </div>

          {/* Stats com Imagens - Muito Menores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="flex justify-center">
              <Image
                src="/100%25%20Digital.png"
                alt="100% Digital"
                width={150}
                height={75}
                className="w-full max-w-[120px] h-auto"
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/Todo o Brasil.png"
                alt="Todo o Brasil"
                width={150}
                height={75}
                className="w-full max-w-[120px] h-auto"
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/Since 2021.png"
                alt="Desde 2021"
                width={150}
                height={75}
                className="w-full max-w-[120px] h-auto"
              />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
