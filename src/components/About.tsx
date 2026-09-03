import { CheckCircle, Target, Eye, Heart } from 'lucide-react'
import { getSiteContentServer } from '@/lib/siteContentServer'

type HomeAboutCard = { title: string; body: string }
type HomeAboutData = {
  header_title?: string
  header_subtitle?: string
  left_title?: string
  paragraphs?: string[]
  quote?: string
  bullets?: string[]
  cards?: HomeAboutCard[]
}

const defaultAbout: Required<HomeAboutData> = {
  header_title: 'Sobre o Escritório',
  header_subtitle: 'Tradição, ética e compromisso com resultados excepcionais',
  left_title: 'Nossa História',
  paragraphs: [
    'Fundado em 2021 no extremo sul da Bahia, o escritório Neves & Costa nasceu do compromisso com uma advocacia ética, acessível e eficiente. Atuamos nas áreas Cível, Trabalhista e Previdenciária, levando soluções jurídicas personalizadas para clientes em todo o Brasil.',
    'Desde 2024, migramos para o formato 100% digital, oferecendo praticidade, rapidez e atendimento humano, independentemente do estado onde você estiver. Atuamos com processos nos tribunais da Bahia, Espírito Santo, Minas Gerais, São Paulo e Rio de Janeiro.',
  ],
  quote: '"Do seu direito, a gente cuida."',
  bullets: [
    'Atendimento 100% digital com segurança e clareza',
    'Advocacia moderna, estratégica e acessível',
    'Atuação em todo o Brasil',
    'Foco em resultado, confiança e proximidade',
  ],
  cards: [
    {
      title: 'Quem Somos',
      body: 'Somos dois advogados formados desde 2018, com atuação jurídica desde 2020. O escritório conta com especialista em Advocacia Cível e segue em constante evolução, com especializações em andamento nas áreas Trabalhista, Previdenciária e Gestão Pública.',
    },
    {
      title: 'Como Atendemos',
      body: 'Desde 2024, o escritório atua 100% online, permitindo que nossos clientes sejam atendidos de forma ágil e segura, independentemente do estado onde estejam. Atuamos com processos nos tribunais da Bahia, Espírito Santo, Minas Gerais, São Paulo e Rio de Janeiro.',
    },
    {
      title: 'Nosso Compromisso',
      body: 'Nosso compromisso é oferecer uma advocacia moderna, estratégica e acessível, sem abrir mão da ética, da confiança e do foco em resultado. Neves & Costa Advocacia, modernidade sem abrir mão da confiança.',
    },
  ],
}

export default async function About() {
  const about = (await getSiteContentServer<HomeAboutData>('home.about')) || {}

  const headerTitle = (about.header_title || '').trim() || defaultAbout.header_title
  const headerSubtitle = (about.header_subtitle || '').trim() || defaultAbout.header_subtitle
  const leftTitle = (about.left_title || '').trim() || defaultAbout.left_title
  const quote = (about.quote || '').trim() || defaultAbout.quote

  const paragraphs = Array.isArray(about.paragraphs) && about.paragraphs.length > 0 ? about.paragraphs : defaultAbout.paragraphs
  const bullets = Array.isArray(about.bullets) && about.bullets.length > 0 ? about.bullets : defaultAbout.bullets
  const cards = Array.isArray(about.cards) && about.cards.length > 0 ? about.cards : defaultAbout.cards

  return (
    <section id="sobre" className="py-16 bg-gradient-to-b from-black via-gray-900 to-black text-white" aria-labelledby="sobre-title">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 id="sobre-title" className="text-4xl md:text-5xl font-bold text-white mb-4">
              {headerTitle}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {headerSubtitle}
            </p>
          </div>


          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Description */}
            <div>
              
              <h3 className="text-2xl font-bold text-gold-400 mb-6">
                {leftTitle}
              </h3>
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-300 mb-6 leading-relaxed">
                  {p}
                </p>
              ))}
              <p className="text-gold-400 font-semibold text-lg mb-6">
                {quote}
              </p>
              
              <ul className="space-y-3" aria-label="Diferenciais do escritório">
                {bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle className="text-gold-500 mt-1 flex-shrink-0" size={20} aria-hidden="true" />
                    <span className="text-gray-300">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Values */}
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gold-500">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="text-gold-500" size={28} />
                  <h4 className="text-xl font-bold text-white">{cards[0]?.title || defaultAbout.cards[0].title}</h4>
                </div>
                <p className="text-gray-300">
                  {cards[0]?.body || defaultAbout.cards[0].body}
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gold-500">
                <div className="flex items-center space-x-3 mb-3">
                  <Eye className="text-gold-500" size={28} />
                  <h4 className="text-xl font-bold text-white">{cards[1]?.title || defaultAbout.cards[1].title}</h4>
                </div>
                <p className="text-gray-300">
                  {cards[1]?.body || defaultAbout.cards[1].body}
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gold-500">
                <div className="flex items-center space-x-3 mb-3">
                  <Heart className="text-gold-500" size={28} />
                  <h4 className="text-xl font-bold text-white">{cards[2]?.title || defaultAbout.cards[2].title}</h4>
                </div>
                <p className="text-gray-300">
                  {cards[2]?.body || defaultAbout.cards[2].body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
