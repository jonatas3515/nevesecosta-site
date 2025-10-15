import Image from 'next/image'
import { CheckCircle, Target, Eye, Heart } from 'lucide-react'

export default function About() {
  return (
    <section id="sobre" className="py-16 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sobre o Escritório
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tradição, ética e compromisso com resultados excepcionais
            </p>
          </div>


          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Description */}
            <div>
              
              <h3 className="text-2xl font-bold text-gold-400 mb-6">
                Nossa História
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Fundado em 2021 no extremo sul da Bahia, o escritório Neves & Costa nasceu do compromisso 
                com uma advocacia ética, acessível e eficiente. Atuamos nas áreas Cível, Trabalhista e 
                Previdenciária, levando soluções jurídicas personalizadas para clientes em todo o Brasil.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Desde 2024, migramos para o formato 100% digital, oferecendo praticidade, rapidez e 
                atendimento humano, independentemente do estado onde você estiver. Atuamos com processos 
                nos tribunais da Bahia, Espírito Santo, Minas Gerais, São Paulo e Rio de Janeiro.
              </p>
              <p className="text-gold-400 font-semibold text-lg mb-6">
                "Do seu direito, a gente cuida."
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-gold-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-300">Atendimento 100% digital com segurança e clareza</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-gold-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-300">Advocacia moderna, estratégica e acessível</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-gold-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-300">Atuação em todo o Brasil</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-gold-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-300">Foco em resultado, confiança e proximidade</span>
                </div>
              </div>
            </div>

            {/* Right Column - Values */}
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gold-500">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="text-gold-500" size={28} />
                  <h4 className="text-xl font-bold text-white">Quem Somos</h4>
                </div>
                <p className="text-gray-300">
                  Somos dois advogados formados desde 2018, com atuação jurídica desde 2020. O escritório 
                  conta com especialista em Advocacia Cível e segue em constante evolução, com especializações 
                  em andamento nas áreas Trabalhista, Previdenciária e Gestão Pública.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gold-500">
                <div className="flex items-center space-x-3 mb-3">
                  <Eye className="text-gold-500" size={28} />
                  <h4 className="text-xl font-bold text-white">Como Atendemos</h4>
                </div>
                <p className="text-gray-300">
                  Desde 2024, o escritório atua 100% online, permitindo que nossos clientes sejam atendidos 
                  de forma ágil e segura, independentemente do estado onde estejam. Atuamos com processos 
                  nos tribunais da Bahia, Espírito Santo, Minas Gerais, São Paulo e Rio de Janeiro.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gold-500">
                <div className="flex items-center space-x-3 mb-3">
                  <Heart className="text-gold-500" size={28} />
                  <h4 className="text-xl font-bold text-white">Nosso Compromisso</h4>
                </div>
                <p className="text-gray-300">
                  Nosso compromisso é oferecer uma advocacia moderna, estratégica e acessível, sem abrir 
                  mão da ética, da confiança e do foco em resultado. Neves & Costa Advocacia, modernidade 
                  sem abrir mão da confiança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
