import {
  Briefcase,
  Building2,
  FileText,
  Gavel,
  Home,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'

import { getSiteContentServer } from '@/lib/siteContentServer'

type PracticeAreaTheme = 'brown' | 'gold' | 'blue' | 'red'

type PracticeAreaItem = {
  icon: keyof typeof iconMap
  title: string
  description: string
  theme: PracticeAreaTheme
}

type PracticeAreasData = {
  title?: string
  subtitle?: string
  items?: PracticeAreaItem[]
  cta_text?: string
  cta_button_label?: string
  cta_button_href?: string
}

const themeMap: Record<PracticeAreaTheme, { color: string; bgColor: string }> = {
  brown: { color: 'text-brown-600', bgColor: 'bg-brown-50' },
  gold: { color: 'text-gold-600', bgColor: 'bg-gold-50' },
  blue: { color: 'text-blue-600', bgColor: 'bg-blue-50' },
  red: { color: 'text-red-600', bgColor: 'bg-red-50' },
}

const iconMap = {
  FileText,
  Briefcase,
  Gavel,
  Shield,
  Users,
  Home,
  Building2,
  TrendingUp,
}

const defaultAreas: PracticeAreaItem[] = [
  {
    icon: 'FileText',
    title: 'Direito Civil',
    description: 'Soluções em contratos, cobranças, indenizações, conflitos familiares e direito das obrigações.',
    theme: 'brown',
  },
  {
    icon: 'Briefcase',
    title: 'Direito Trabalhista',
    description: 'Direitos do trabalhador, rescisões, verbas não pagas, acidentes de trabalho e ações contra empregadores.',
    theme: 'gold',
  },
  {
    icon: 'Gavel',
    title: 'Direito Previdenciário',
    description: 'Aposentadorias, pensões, auxílios do INSS e revisão de benefícios.',
    theme: 'blue',
  },
  {
    icon: 'Shield',
    title: 'Direito do Consumidor',
    description: 'Defesa de consumidores em cobranças indevidas, compras online, negativa de planos e falhas na prestação de serviços.',
    theme: 'red',
  },
]

export default async function PracticeAreas() {
  const cms = (await getSiteContentServer<PracticeAreasData>('home.practice_areas')) || {}

  const title = (cms.title || '').trim() || 'Áreas de Atuação'
  const subtitle = (cms.subtitle || '').trim() || 'Expertise em diversas áreas do direito para atender todas as suas necessidades jurídicas'
  const ctaText = (cms.cta_text || '').trim() || 'Não encontrou a área que procura? Entre em contato conosco!'
  const ctaButtonLabel = (cms.cta_button_label || '').trim() || 'Fale Conosco'
  const ctaButtonHref = (cms.cta_button_href || '').trim() || '#contato'

  const items = Array.isArray(cms.items) && cms.items.length > 0 ? cms.items : defaultAreas

  return (
    <section id="areas" className="py-16 bg-black" aria-labelledby="areas-title">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 id="areas-title" className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" role="list" aria-label="Lista de áreas de atuação">
            {items.map((area, index) => {
              const Icon = iconMap[area.icon] || FileText
              const theme = themeMap[area.theme] || themeMap.brown
              return (
                <article
                  key={index}
                  role="listitem"
                  className="group bg-gray-900 border border-gold-500/20 rounded-lg p-6 hover:shadow-xl hover:shadow-gold-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-gold-500/50"
                >
                  <div className={`${theme.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={theme.color} size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {area.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {area.description}
                  </p>
                </article>
              )
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">
              {ctaText}
            </p>
            <a
              href={ctaButtonHref}
              className="inline-block bg-gold-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
            >
              {ctaButtonLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
