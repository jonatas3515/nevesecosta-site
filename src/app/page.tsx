import Hero from '@/components/Hero'
import About from '@/components/About'
import PracticeAreas from '@/components/PracticeAreas'
import Reviews from '@/components/Reviews'
import Contact from '@/components/Contact'
import WarningModal from '@/components/WarningModal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advocacia em Itamaraju • Direito Civil, Trabalhista, Previdenciário e do Consumidor',
  description: 'Neves & Costa Advocacia e Consultoria. Atuação em Itamaraju/BA e todo o Brasil. Do seu direito, a gente cuida.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <PracticeAreas />
      <Reviews />
      <Contact />
      <WarningModal />
    </>
  )
}
