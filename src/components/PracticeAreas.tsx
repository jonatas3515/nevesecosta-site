import { 
  Briefcase, 
  Users, 
  Home, 
  Building2, 
  FileText, 
  Gavel,
  TrendingUp,
  Shield
} from 'lucide-react'

const areas = [
  {
    icon: FileText,
    title: 'Direito Civil',
    description: 'Soluções em contratos, cobranças, indenizações, conflitos familiares e direito das obrigações.',
    color: 'text-brown-600',
    bgColor: 'bg-brown-50',
  },
  {
    icon: Briefcase,
    title: 'Direito Trabalhista',
    description: 'Direitos do trabalhador, rescisões, verbas não pagas, acidentes de trabalho e ações contra empregadores.',
    color: 'text-gold-600',
    bgColor: 'bg-gold-50',
  },
  {
    icon: Gavel,
    title: 'Direito Previdenciário',
    description: 'Aposentadorias, pensões, auxílios do INSS e revisão de benefícios.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Shield,
    title: 'Direito do Consumidor',
    description: 'Defesa de consumidores em cobranças indevidas, compras online, negativa de planos e falhas na prestação de serviços.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
]

export default function PracticeAreas() {
  return (
    <section id="areas" className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Áreas de Atuação
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Expertise em diversas áreas do direito para atender todas as suas necessidades jurídicas
            </p>
          </div>

          {/* Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {areas.map((area, index) => {
              const Icon = area.icon
              return (
                <div
                  key={index}
                  className="group bg-gray-900 border border-gold-500/20 rounded-lg p-6 hover:shadow-xl hover:shadow-gold-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-gold-500/50"
                >
                  <div className={`${area.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={area.color} size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {area.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {area.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">
              Não encontrou a área que procura? Entre em contato conosco!
            </p>
            <a
              href="#contato"
              className="inline-block bg-gold-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
