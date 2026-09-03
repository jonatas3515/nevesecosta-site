import Hero from '@/components/Hero'
import About from '@/components/About'
import PracticeAreas from '@/components/PracticeAreas'
import Reviews from '@/components/Reviews'
import Contact from '@/components/Contact'
import WarningModal from '@/components/WarningModal'
import type { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export const metadata: Metadata = {
  title: 'Advocacia em Itamaraju • Direito Civil, Trabalhista, Previdenciário e do Consumidor',
  description: 'Neves & Costa Advocacia e Consultoria. Atuação em Itamaraju/BA e todo o Brasil. Do seu direito, a gente cuida.',
  alternates: { canonical: '/' },
}

export default async function Home() {
  noStore()

  let warningSettings: {
    warning_enabled: boolean
    warning_title?: string
    warning_body?: string
    warning_type?: 'text' | 'video'
    video_url?: string
    phone?: string
    email?: string
    title_align?: 'left'|'center'|'right'
    title_size?: 'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'
    title_color?: string
    body_align?: 'left'|'center'|'right'|'justify'
  } | null = null

  let bannerSettings: {
    id: string
    image_url: string
    link_url?: string
    is_active: boolean
  } | null = null

  try {
    const supabase = getSupabaseAdmin()

    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('warning_enabled, warning_title, warning_body, warning_type, video_url, phone, email, title_align, title_size, title_color, body_align')
      .eq('id', 'default')
      .maybeSingle()

    warningSettings = (settingsData as any) || null

    const { data: bannerData } = await supabase
      .from('banner_settings')
      .select('id, image_url, link_url, is_active')
      .order('created_at', { ascending: false })
      .limit(1)

    bannerSettings = (bannerData?.[0] as any) || null
  } catch {
    // fallback: nenhum dado
  }

  return (
    <>
      <Hero />
      <About />
      <PracticeAreas />
      <Reviews />
      <Contact />
      <WarningModal settings={warningSettings} bannerSettings={bannerSettings} />
    </>
  )
}
