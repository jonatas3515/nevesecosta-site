import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const teamMembers = [
  {
    id: 'jonatas-costa',
    name: 'Jonatas Costa',
    oab: 'OAB/BA 69.148',
    photo: '/Foto do advogado.png',
    specialties: ['Direito Civil', 'Direito do Consumidor', 'Direito Trabalhista'],
  },
  {
    id: 'osmar-neves',
    name: 'Osmar Neves',
    oab: 'OAB/BA 58.799',
    photo: '/Advogado 2.png',
    specialties: ['Direito Trabalhista', 'Direito Previdenciário'],
  },
]

export default function EquipePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-gold-400 hover:text-gold-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar ao Início
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nossa Equipe
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Conheça os profissionais que fazem a diferença na Neves & Costa Advocacia
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900 rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/50 transition-all"
            >
              {/* Foto */}
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-500/20">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={300}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Informações */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {member.name}
                </h2>
                
                <p className="text-gold-400 font-semibold mb-4">
                  {member.oab}
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Especialidades:
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-sm border border-gold-500/30"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botão Ver Currículo */}
                <Link
                  href={`/equipe/${member.id}`}
                  className="inline-flex items-center bg-gold-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Ver Currículo
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gray-900 rounded-2xl p-8 border border-gold-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Precisa de Ajuda Jurídica?
          </h2>
          <p className="text-gray-300 mb-6">
            Nossa equipe está pronta para cuidar do seu direito com dedicação e expertise.
          </p>
          <Link
            href="/#contato"
            className="inline-block bg-gold-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
          >
            Entre em Contato
          </Link>
        </div>
      </div>
    </div>
  )
}
