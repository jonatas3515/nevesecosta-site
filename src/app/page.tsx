import Hero from '@/components/Hero'
import About from '@/components/About'
import PracticeAreas from '@/components/PracticeAreas'
import Reviews from '@/components/Reviews'
import Contact from '@/components/Contact'
import WarningModal from '@/components/WarningModal'

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
