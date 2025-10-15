import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Award, BookOpen, Briefcase } from 'lucide-react'

export default function OsmarCurriculo() {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/equipe"
            className="inline-flex items-center text-gold-400 hover:text-gold-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar à Equipe
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Foto e Informações Básicas */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gold-500/20 sticky top-24">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-500/20 mb-6">
                <Image
                  src="/Advogado 2.png"
                  alt="Osmar Neves"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Osmar Neves
                </h1>
                <p className="text-gold-400 font-semibold mb-4">
                  OAB/BA 58.799
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2 text-gray-300">
                    <Mail size={16} />
                    <span>contato@nevesecosta.com.br</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-300">
                    <Phone size={16} />
                    <span>(73) 9 8862-0915</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo do Currículo */}
          <div className="md:col-span-2 space-y-8">
            {/* Sobre */}
            <section className="bg-gray-900 rounded-2xl p-6 border border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400 mb-4 flex items-center">
                <Award className="mr-3" size={24} />
                Sobre
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Advogado especialista em Direito Trabalhista e Previdenciário, com ampla experiência 
                desde 2018. Formado em Direito em 2018, dedica-se a defender os direitos dos 
                trabalhadores e segurados do INSS. Atua com foco em processos trabalhistas, 
                aposentadorias, pensões e benefícios previdenciários.
              </p>
            </section>

            {/* Formação */}
            <section className="bg-gray-900 rounded-2xl p-6 border border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400 mb-4 flex items-center">
                <BookOpen className="mr-3" size={24} />
                Formação Acadêmica
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-gold-500 pl-4">
                  <h3 className="text-lg font-semibold text-white">
                    Bacharel em Direito
                  </h3>
                  <p className="text-gray-400">2018</p>
                  <p className="text-gray-300">
                    Graduação com foco em Direito Trabalhista e Previdenciário
                  </p>
                </div>
                
                <div className="border-l-4 border-gold-500 pl-4">
                  <h3 className="text-lg font-semibold text-white">
                    Especializando em Gestão Pública
                  </h3>
                  <p className="text-gray-400">Em andamento</p>
                  <p className="text-gray-300">
                    Especialização focada em gestão pública e administração
                  </p>
                </div>
              </div>
            </section>

            {/* Experiência */}
            <section className="bg-gray-900 rounded-2xl p-6 border border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400 mb-4 flex items-center">
                <Briefcase className="mr-3" size={24} />
                Experiência Profissional
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-gold-500 pl-4">
                  <h3 className="text-lg font-semibold text-white">
                    Sócio-Fundador - Neves & Costa Advocacia
                  </h3>
                  <p className="text-gray-400">2021 - Presente</p>
                  <p className="text-gray-300">
                    Co-fundação do escritório, especialização em atendimento 100% digital, 
                    atuação em todo o Brasil nas áreas Trabalhista e Previdenciária.
                  </p>
                </div>
                
                <div className="border-l-4 border-gold-500 pl-4">
                  <h3 className="text-lg font-semibold text-white">
                    Advogado Trabalhista
                  </h3>
                  <p className="text-gray-400">2018 - 2021</p>
                  <p className="text-gray-300">
                    Atuação em processos trabalhistas, desenvolvendo expertise em direitos 
                    do trabalhador e rescisões contratuais.
                  </p>
                </div>
              </div>
            </section>

            {/* Áreas de Especialização */}
            <section className="bg-gray-900 rounded-2xl p-6 border border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400 mb-4">
                Áreas de Especialização
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Direito Trabalhista</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Direitos do trabalhador</li>
                    <li>• Rescisões contratuais</li>
                    <li>• Verbas não pagas</li>
                    <li>• Acidentes de trabalho</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Direito Previdenciário</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Aposentadorias</li>
                    <li>• Pensões por morte</li>
                    <li>• Auxílios do INSS</li>
                    <li>• Revisões de benefícios</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
