import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'

export default function AreasPage() {
  const areas = [
    {
      title: 'Direito Civil',
      desc: 'Contratos, responsabilidade civil, danos morais e materiais, indenizações.',
      href: '/blog?categoria=Direito Civil',
    },
    {
      title: 'Direito do Consumidor',
      desc: 'Cobranças indevidas, vício do produto/serviço, negativação indevida.',
      href: '/blog?categoria=Direito do Consumidor',
    },
    {
      title: 'Direito Trabalhista',
      desc: 'Rescisão, verbas trabalhistas, horas extras, assédio, adicionais.',
      href: '/blog?categoria=Direito do Trabalho',
    },
    {
      title: 'Direito Previdenciário',
      desc: 'Aposentadorias, auxílios, revisões e planejamento previdenciário.',
      href: '/blog?categoria=Direito Previdenciário',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-32">
      {/* Breadcrumb JSON-LD */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Áreas de Atuação', item: 'https://www.nevesecosta.com.br/areas' },
          ],
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Áreas de Atuação</h1>
            <p className="text-lg text-gray-300">Atuação estratégica em Direito Civil, Consumidor, Trabalhista e Previdenciário.</p>
          </header>

          <section className="grid md:grid-cols-2 gap-6 mb-12">
            {areas.map((a) => (
              <div key={a.title} className="bg-gray-900 rounded-2xl p-8 border border-gold-500/20">
                <h2 className="text-2xl font-bold text-gold-400 mb-2">{a.title}</h2>
                <p className="text-gray-300 mb-4">{a.desc}</p>
                <Link href={a.href} className="text-gold-500 hover:text-gold-400 font-semibold">Ver conteúdos relacionados</Link>
              </div>
            ))}
          </section>

          {/* CTAs de Links Internos */}
          <section className="bg-gray-900 rounded-2xl p-8 border border-gold-500/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Precisa de orientação?</h2>
            <p className="text-gray-300 mb-6">Fale com nossa equipe ou conheça nosso Blog.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/blog" className="px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700">Blog</Link>
              <Link href="/#contato" className="px-6 py-3 rounded-lg bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600">Fale Conosco</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
