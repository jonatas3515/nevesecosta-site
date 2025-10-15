import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Award, BookOpen, Briefcase } from 'lucide-react'

export default function JonatasCurriculo() {
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
                  src="/Foto do advogado.png"
                  alt="Jonatas Costa"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Jonatas Costa
                </h1>
                <p className="text-gold-400 font-semibold mb-4">
                  OAB/BA 69.148
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2 text-gray-300">
                    <Mail size={16} />
                    <span>contato@nevesecosta.com.br</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-300">
                    <Phone size={16} />
                    <span>(73) 9 9934-8552</span>
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
              <p className="text-gray-300 leading-relaxed mb-4">
                Especialista em Advocacia Cível (2023) e Pós-graduando em Advocacia Trabalhista e Previdenciária pela Faculdade de Direito da Fundação Escola Superior do Ministério Público (2024). Graduado em Direito pelo Centro de Ensino Superior do Extremo Sul da Bahia - FACISA/CESESB (2018). Tem experiência na área de Direito, com ênfase em Direito Privado.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Currículo Lattes:</p>
                <a 
                  href="http://lattes.cnpq.br/3222982073576723" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 text-sm underline"
                >
                  http://lattes.cnpq.br/3222982073576723
                </a>
              </div>
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
                    Graduação em Direito
                  </h3>
                  <p className="text-gray-400">2013 - 2018</p>
                  <p className="text-gray-300">
                    Centro de Ensino Superior do Extremo Sul da Bahia - FACISA/CESESB
                  </p>
                  <p className="text-sm text-gray-400">
                    Título: RESPONSABILIDADE CIVIL POR VÍCIO DO PRODUTO OU SERVIÇO
                  </p>
                </div>
                
                <div className="border-l-4 border-gold-500 pl-4">
                  <h3 className="text-lg font-semibold text-white">
                    Especialização em Advocacia Cível
                  </h3>
                  <p className="text-gray-400">2022 - 2023</p>
                  <p className="text-gray-300">
                    Fundação Escola Superior do Ministério Público - RS (360h)
                  </p>
                  <p className="text-sm text-gray-400">
                    Bolsista da Ordem dos Advogados do Brasil - OAB
                  </p>
                </div>
                
                <div className="border-l-4 border-gold-500 pl-4">
                  <h3 className="text-lg font-semibold text-white">
                    Pós-graduação em Advocacia Trabalhista e Previdenciária
                  </h3>
                  <p className="text-gray-400">2024 - Em andamento</p>
                  <p className="text-gray-300">
                    Faculdade de Direito da Fundação Escola Superior do Ministério Público
                  </p>
                </div>
                
                <div className="border-l-4 border-gold-500 pl-4">
                  <h3 className="text-lg font-semibold text-white">
                    Aperfeiçoamento em Formação Docente para EAD
                  </h3>
                  <p className="text-gray-400">2024</p>
                  <p className="text-gray-300">
                    Instituto Federal de Educação, Ciência e Tecnologia do Espírito Santo - IFES (180h)
                  </p>
                </div>
              </div>
            </section>

            {/* Formação Complementar */}
            <section className="bg-gray-900 rounded-2xl p-6 border border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400 mb-4 flex items-center">
                <BookOpen className="mr-3" size={24} />
                Formação Complementar Recente
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Cibersegurança</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Programa Hackers do Bem - Fundamental (96h)</li>
                    <li>• Programa Hackers do Bem - Básico (64h)</li>
                    <li>• Nivelamento em Cibersegurança (80h)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Tecnologia e IA</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Inteligência Artificial e Visão Computacional (240h)</li>
                    <li>• Machine Learning e No Code (15h)</li>
                    <li>• Engenharia de Prompt com ChatGPT (15h)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Educação</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Formação de Orientadores EAD (60h)</li>
                    <li>• Transformando Ideias com Fuse (15h)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Direito Público</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Direito Administrativo para Gerentes (35h)</li>
                    <li>• Licitação e Contratos Administrativos (60h)</li>
                    <li>• Direito do Consumidor - ILB/ANATEL (40h)</li>
                  </ul>
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
                    Fundação e gestão do escritório, especialização em atendimento 100% digital, 
                    atuação em todo o Brasil nas áreas Civil, Consumidor e Trabalhista.
                  </p>
                </div>
                
                <div className="border-l-4 border-gold-500 pl-4">
                  <h3 className="text-lg font-semibold text-white">
                    Advogado Autônomo
                  </h3>
                  <p className="text-gray-400">2018 - 2021</p>
                  <p className="text-gray-300">
                    Atuação independente com foco em Direito Civil e do Consumidor, desenvolvendo expertise 
                    em contratos, responsabilidade civil e defesa do consumidor.
                  </p>
                </div>
              </div>
            </section>

            {/* Áreas de Especialização */}
            <section className="bg-gray-900 rounded-2xl p-6 border border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400 mb-4">
                Áreas de Especialização
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Direito Civil</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Contratos em geral</li>
                    <li>• Cobranças judiciais</li>
                    <li>• Indenizações</li>
                    <li>• Direito das obrigações</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Direito do Consumidor</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Defesa do consumidor</li>
                    <li>• Cobranças indevidas</li>
                    <li>• Compras online</li>
                    <li>• Falhas em serviços</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Direito Trabalhista</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Direitos do trabalhador</li>
                    <li>• Rescisões contratuais</li>
                    <li>• Verbas não pagas</li>
                    <li>• Horas extras</li>
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
