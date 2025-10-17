import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32">
      {/* Breadcrumb JSON-LD */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Sobre', item: 'https://www.nevesecosta.com.br/sobre' },
          ],
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sobre a Neves & Costa</h1>
            <p className="text-lg text-gray-300">Do seu direito, a gente cuida. Advocacia 100% digital com atuação em Direito Civil, Trabalhista, Previdenciário e do Consumidor.</p>
          </header>

          <section className="bg-gray-900 rounded-2xl p-8 border border-gold-500/20 mb-8">
            <h2 className="text-2xl font-bold text-gold-400 mb-4">Propósito</h2>
            <p className="text-gray-300 leading-7">Atender com clareza, agilidade e transparência, oferecendo soluções jurídicas eficazes para pessoas e empresas no Extremo Sul da Bahia e em todo o Brasil.</p>
          </section>

          <section className="bg-gray-900 rounded-2xl p-8 border border-gold-500/20 mb-8">
            <h2 className="text-2xl font-bold text-gold-400 mb-4">Nossos Valores</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Ética e responsabilidade</li>
              <li>Empatia e comunicação clara</li>
              <li>Atualização contínua</li>
              <li>Compromisso com resultados</li>
            </ul>
          </section>

          {/* CTAs de Links Internos */}
          <section className="bg-gray-900 rounded-2xl p-8 border border-gold-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">Continue navegando</h2>
            <p className="text-gray-300 mb-6">Conheça nossas áreas de atuação, acompanhe nossos artigos ou fale com a equipe.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/areas" className="px-6 py-3 rounded-lg bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600">Áreas de Atuação</Link>
              <Link href="/blog" className="px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700">Blog</Link>
              <Link href="/#contato" className="px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-200">Fale Conosco</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
