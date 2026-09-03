/**
 * ATENÇÃO: ARQUIVO CRÍTICO - CMS INTERNO
 * 
 * Este arquivo gerencia todo o conteúdo editável do site:
 * - Header, Hero, Sobre, Áreas de Atuação
 * - Contato, Footer, SEO global
 * 
 * NÃO refatorar sem:
 * 1. Backup completo do conteúdo atual no Supabase
 * 2. Testes de edição e salvamento em staging
 * 3. Validação de que todos os campos são preservados
 * 
 * Os tipos locais (HeaderNavData, HomeContactData, etc.) são específicos
 * deste CMS e NÃO devem ser unificados com @/types sem análise campo a campo.
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSiteContent, listSiteContentKeys, upsertSiteContent } from '@/lib/siteContent'

type HeaderNavItem = { name: string; href: string }

type HeaderNavData = {
  items: HeaderNavItem[]
  cta?: { label: string; href: string }
}

type GlobalSeoData = {
  title_default?: string
  title_template?: string
  description?: string
  keywords?: string[]
  og_image?: string
  twitter_image?: string
}

type HomeHeroCta = { label: string; href: string }
type HomeHeroStat = { src: string; alt: string }
type HomeHeroData = {
  badge_text?: string
  headline_line1?: string
  headline_highlight?: string
  subheadline?: string
  logo_src?: string
  logo_alt?: string
  cta_primary?: HomeHeroCta
  cta_secondary?: HomeHeroCta
  cta_tertiary?: HomeHeroCta
  stats?: HomeHeroStat[]
}

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

type PracticeAreaTheme = 'brown' | 'gold' | 'blue' | 'red'
type PracticeAreaIcon = 'FileText' | 'Briefcase' | 'Gavel' | 'Shield' | 'Users' | 'Home' | 'Building2' | 'TrendingUp'
type PracticeAreaItem = {
  icon: PracticeAreaIcon
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

type ContactSubjectOption = { value: string; label: string }
type HomeContactData = {
  header_title?: string
  header_subtitle?: string
  info_title?: string

  location_title?: string
  location_lines?: string[]

  phone_title?: string
  phone_lines?: string[]

  email_title?: string
  email_lines?: string[]

  hours_title?: string
  hours_lines?: string[]

  infobox_title?: string
  infobox_body?: string
  infobox_list_title?: string
  infobox_list_items?: string[]
  infobox_quote?: string

  form_title?: string
  submit_button_label?: string
  success_title?: string
  success_message?: string

  name_label?: string
  name_placeholder?: string
  email_label?: string
  email_placeholder?: string
  phone_label?: string
  phone_placeholder?: string
  subject_label?: string
  subject_placeholder?: string
  message_label?: string
  message_placeholder?: string

  subject_options?: ContactSubjectOption[]

  whatsapp_phone?: string
  to_email?: string
}

type FooterSocialPlatform = 'facebook' | 'instagram' | 'linkedin'
type FooterSocialLink = { platform: FooterSocialPlatform; url: string; aria_label?: string }
type FooterQuickLink = { label: string; href: string }

type FooterData = {
  logo_src?: string
  logo_alt?: string
  description?: string
  social?: FooterSocialLink[]

  quick_links_title?: string
  quick_links?: FooterQuickLink[]

  practice_areas_title?: string
  practice_areas?: string[]

  contact_title?: string
  contact_location_lines?: string[]
  contact_phone_lines?: string[]
  contact_email_lines?: string[]

  copyright_text?: string
  producer_name?: string
  producer_url?: string
}

export default function SiteContentAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'header' | 'hero' | 'about' | 'areas' | 'contact' | 'footer' | 'seo' | 'raw'>('header')

  const [headerNav, setHeaderNav] = useState<HeaderNavData>({
    items: [
      { name: 'Início', href: '/' },
      { name: 'Sobre', href: '/#sobre' },
      { name: 'Equipe', href: '/equipe' },
      { name: 'Áreas de Atuação', href: '/#areas' },
      { name: 'Calculadora', href: '/calculadora' },
      { name: 'Consulta Processo', href: '/consulta-processo' },
      { name: 'Blog', href: '/blog' },
      { name: 'Avaliações', href: '/#avaliacoes' },
      { name: 'Contato', href: '/#contato' },
    ],
    cta: { label: 'Consulta Aqui', href: '/#contato' },
  })

  const [contact, setContact] = useState<HomeContactData>({
    header_title: 'Entre em Contato',
    header_subtitle: 'Estamos prontos para atender você. Agende uma consulta gratuita!',
    info_title: 'Informações de Contato',

    location_title: 'Localização',
    location_lines: ['Extremo Sul da Bahia', 'Atendimento 100% Digital', 'Atuação em todo o Brasil'],

    phone_title: 'Telefone / WhatsApp',
    phone_lines: ['(73) 99934-8552', '(73) 98862-0915'],

    email_title: 'E-mail',
    email_lines: ['nevesecosta.esc@gmail.com', 'contato@nevesecosta.com.br'],

    hours_title: 'Horário de Atendimento',
    hours_lines: ['Segunda a Sexta: 8h às 18h', 'Atendimento Online', 'Resposta rápida via WhatsApp'],

    infobox_title: '📍 Atendimento 100% Digital',
    infobox_body: 'Nosso escritório atua de forma totalmente online, permitindo que você seja atendido com segurança e agilidade, independentemente de onde esteja.',
    infobox_list_title: '⚡ Atuação nos Tribunais:',
    infobox_list_items: ['Bahia (TJ-BA e TRT-5)', 'Espírito Santo', 'Minas Gerais', 'São Paulo', 'Rio de Janeiro'],
    infobox_quote: '"Do seu direito, a gente cuida."',

    form_title: 'Envie uma Mensagem',
    submit_button_label: 'Enviar Mensagem',
    success_title: 'Mensagem Enviada!',
    success_message: 'Obrigado pelo contato. Retornaremos em breve!',

    name_label: 'Nome Completo *',
    name_placeholder: 'Seu nome',
    email_label: 'E-mail *',
    email_placeholder: 'seu@email.com',
    phone_label: 'Telefone *',
    phone_placeholder: '(11) 12345-6789',
    subject_label: 'Assunto *',
    subject_placeholder: 'Selecione uma área',
    message_label: 'Mensagem *',
    message_placeholder: 'Descreva sua situação...',

    subject_options: [
      { value: 'trabalhista', label: 'Direito Trabalhista' },
      { value: 'familia', label: 'Direito de Família' },
      { value: 'imobiliario', label: 'Direito Imobiliário' },
      { value: 'empresarial', label: 'Direito Empresarial' },
      { value: 'civil', label: 'Direito Civil' },
      { value: 'previdenciario', label: 'Direito Previdenciário' },
      { value: 'tributario', label: 'Direito Tributário' },
      { value: 'consumidor', label: 'Direito do Consumidor' },
      { value: 'outro', label: 'Outro' },
    ],

    whatsapp_phone: '5573999348552',
    to_email: 'contato@nevesecosta.com.br',
  })

  const [practiceAreas, setPracticeAreas] = useState<PracticeAreasData>({
    title: 'Áreas de Atuação',
    subtitle: 'Expertise em diversas áreas do direito para atender todas as suas necessidades jurídicas',
    items: [
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
    ],
    cta_text: 'Não encontrou a área que procura? Entre em contato conosco!',
    cta_button_label: 'Fale Conosco',
    cta_button_href: '#contato',
  })

  const [about, setAbout] = useState<HomeAboutData>({
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
  })

  const [footer, setFooter] = useState<FooterData>({
    logo_src: '/Logo.png',
    logo_alt: 'Neves & Costa Advocacia',
    description: 'Do seu direito, a gente cuida. Advocacia 100% digital do Extremo Sul da Bahia para todo o Brasil.',
    social: [
      { platform: 'facebook', url: 'https://www.facebook.com/jonatas.donascimento', aria_label: 'Facebook' },
      { platform: 'instagram', url: 'https://www.instagram.com/neves.e.costa/', aria_label: 'Instagram' },
      { platform: 'linkedin', url: '#', aria_label: 'LinkedIn' },
    ],
    quick_links_title: 'Links Rápidos',
    quick_links: [
      { label: 'Início', href: '/' },
      { label: 'Sobre Nós', href: '#sobre' },
      { label: 'Áreas de Atuação', href: '#areas' },
      { label: 'Blog', href: '/blog' },
    ],
    practice_areas_title: 'Áreas de Atuação',
    practice_areas: ['Direito Civil', 'Direito Trabalhista', 'Direito Previdenciário', 'Direito do Consumidor'],
    contact_title: 'Contato',
    contact_location_lines: ['Extremo Sul da Bahia', 'Atendimento 100% Digital', 'Atuação em todo o Brasil'],
    contact_phone_lines: ['(73) 99934-8552', '(73) 98862-0915'],
    contact_email_lines: ['nevesecosta.esc@gmail.com', 'contato@nevesecosta.com.br'],
    copyright_text: '&copy; {year} Neves & Costa Advocacia. Todos os direitos reservados.',
    producer_name: '',
    producer_url: '',
  })

  const [seo, setSeo] = useState<GlobalSeoData>({
    title_default: 'Neves & Costa Advocacia e Consultoria',
    title_template: '%s • Neves & Costa',
    description: 'Escritório de advocacia do Extremo Sul da Bahia. Direito Civil, Trabalhista, Previdenciário e do Consumidor. Atendimento em todo o Brasil.',
    keywords: ['advocacia', 'advogado', 'direito', 'Bahia', 'Itamaraju'],
    og_image: '/Logo transparente.png',
    twitter_image: '/Logo transparente.png',
  })

  const [hero, setHero] = useState<HomeHeroData>({
    badge_text: 'Advocacia 100% Digital desde 2021',
    headline_line1: 'Do Seu Direito,',
    headline_highlight: 'A Gente Cuida',
    subheadline: 'Do Extremo Sul da Bahia para todo o Brasil. Advocacia 100% digital com segurança, clareza e dedicação.',
    logo_src: '/Logo transparente.png',
    logo_alt: 'Neves & Costa Logo',
    cta_primary: { label: 'Agende uma Consulta', href: '#contato' },
    cta_secondary: { label: 'Nossas Especialidades', href: '/#areas' },
    cta_tertiary: { label: 'Calcule sua Rescisão Aqui', href: '/calculadora' },
    stats: [
      { src: '/100%25%20Digital.png', alt: '100% Digital' },
      { src: '/Todo o Brasil.png', alt: 'Todo o Brasil' },
      { src: '/Since 2021.png', alt: 'Desde 2021' },
    ],
  })

  const [allKeys, setAllKeys] = useState<string[]>([])
  const [rawKey, setRawKey] = useState('header.nav')
  const [rawJson, setRawJson] = useState('')
  const [rawError, setRawError] = useState('')

  const rawHint = useMemo(() => {
    if (rawKey === 'header.nav') return 'Exemplo: {"items":[{"name":"Início","href":"/"}],"cta":{"label":"Consulta Aqui","href":"/#contato"}}'
    if (rawKey === 'global.seo') return 'Exemplo: {"title_default":"...","description":"...","keywords":["..."]}'
    if (rawKey === 'home.hero') return 'Exemplo: {"badge_text":"...","headline_line1":"...","headline_highlight":"...","cta_primary":{"label":"...","href":"..."}}'
    if (rawKey === 'home.about') return 'Exemplo: {"header_title":"...","paragraphs":["..."],"bullets":["..."]}'
    if (rawKey === 'home.practice_areas') return 'Exemplo: {"title":"...","items":[{"icon":"FileText","title":"...","description":"...","theme":"gold"}]}'
    if (rawKey === 'home.contact') return 'Exemplo: {"header_title":"...","phone_lines":["..."],"subject_options":[{"value":"civil","label":"Direito Civil"}]}'
    if (rawKey === 'footer') return 'Exemplo: {"description":"...","quick_links":[{"label":"Início","href":"/"}],"practice_areas":["Direito Civil"]}'
    return 'Cole um JSON válido.'
  }, [rawKey])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [keys, headerData, seoData, heroData, aboutData, practiceAreasData, contactData, footerData] = await Promise.all([
          listSiteContentKeys(),
          getSiteContent<HeaderNavData>('header.nav'),
          getSiteContent<GlobalSeoData>('global.seo'),
          getSiteContent<HomeHeroData>('home.hero'),
          getSiteContent<HomeAboutData>('home.about'),
          getSiteContent<PracticeAreasData>('home.practice_areas'),
          getSiteContent<HomeContactData>('home.contact'),
          getSiteContent<FooterData>('footer'),
        ])

        setAllKeys(keys)

        if (headerData?.items?.length) {
          setHeaderNav({
            items: headerData.items,
            cta: headerData.cta || { label: 'Consulta Aqui', href: '/#contato' },
          })
        }

        if (seoData) {
          setSeo({
            title_default: seoData.title_default ?? seo.title_default,
            title_template: seoData.title_template ?? seo.title_template,
            description: seoData.description ?? seo.description,
            keywords: Array.isArray(seoData.keywords) ? seoData.keywords : seo.keywords,
            og_image: seoData.og_image ?? seo.og_image,
            twitter_image: seoData.twitter_image ?? seo.twitter_image,
          })
        }

        if (heroData) {
          setHero((p) => ({
            ...p,
            ...heroData,
            cta_primary: heroData.cta_primary || p.cta_primary,
            cta_secondary: heroData.cta_secondary || p.cta_secondary,
            cta_tertiary: heroData.cta_tertiary || p.cta_tertiary,
            stats: Array.isArray(heroData.stats) ? heroData.stats : p.stats,
          }))
        }

        if (aboutData) {
          setAbout((p) => ({
            ...p,
            ...aboutData,
            paragraphs: Array.isArray(aboutData.paragraphs) ? aboutData.paragraphs : p.paragraphs,
            bullets: Array.isArray(aboutData.bullets) ? aboutData.bullets : p.bullets,
            cards: Array.isArray(aboutData.cards) ? aboutData.cards : p.cards,
          }))
        }

        if (practiceAreasData) {
          setPracticeAreas((p) => ({
            ...p,
            ...practiceAreasData,
            items: Array.isArray(practiceAreasData.items) ? practiceAreasData.items : p.items,
          }))
        }

        if (contactData) {
          setContact((p) => ({
            ...p,
            ...contactData,
            location_lines: Array.isArray(contactData.location_lines) ? contactData.location_lines : p.location_lines,
            phone_lines: Array.isArray(contactData.phone_lines) ? contactData.phone_lines : p.phone_lines,
            email_lines: Array.isArray(contactData.email_lines) ? contactData.email_lines : p.email_lines,
            hours_lines: Array.isArray(contactData.hours_lines) ? contactData.hours_lines : p.hours_lines,
            infobox_list_items: Array.isArray(contactData.infobox_list_items) ? contactData.infobox_list_items : p.infobox_list_items,
            subject_options: Array.isArray(contactData.subject_options) ? contactData.subject_options : p.subject_options,
          }))
        }

        if (footerData) {
          setFooter((p) => ({
            ...p,
            ...footerData,
            social: Array.isArray(footerData.social) ? footerData.social : p.social,
            quick_links: Array.isArray(footerData.quick_links) ? footerData.quick_links : p.quick_links,
            practice_areas: Array.isArray(footerData.practice_areas) ? footerData.practice_areas : p.practice_areas,
            contact_location_lines: Array.isArray(footerData.contact_location_lines)
              ? footerData.contact_location_lines
              : p.contact_location_lines,
            contact_phone_lines: Array.isArray(footerData.contact_phone_lines) ? footerData.contact_phone_lines : p.contact_phone_lines,
            contact_email_lines: Array.isArray(footerData.contact_email_lines) ? footerData.contact_email_lines : p.contact_email_lines,
          }))
        }
      } catch {
        // Se a tabela ainda não existir no Supabase, a UI continua com fallback.
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveHeader = async () => {
    setSaving(true)
    try {
      await upsertSiteContent('header.nav', headerNav)
      const keys = await listSiteContentKeys()
      setAllKeys(keys)
      alert('Menu do Header salvo!')
    } catch (e: any) {
      alert('Erro ao salvar menu: ' + (e?.message || String(e)))
    } finally {
      setSaving(false)
    }
  }

  const saveFooter = async () => {
    setSaving(true)
    try {
      await upsertSiteContent('footer', footer)
      const keys = await listSiteContentKeys()
      setAllKeys(keys)
      alert('Footer salvo!')
    } catch (e: any) {
      alert('Erro ao salvar Footer: ' + (e?.message || String(e)))
    } finally {
      setSaving(false)
    }
  }

  const saveSeo = async () => {
    setSaving(true)
    try {
      await upsertSiteContent('global.seo', seo)
      const keys = await listSiteContentKeys()
      setAllKeys(keys)
      alert('SEO Global salvo!')
    } catch (e: any) {
      alert('Erro ao salvar SEO: ' + (e?.message || String(e)))
    } finally {
      setSaving(false)
    }
  }

  const saveHero = async () => {
    setSaving(true)
    try {
      await upsertSiteContent('home.hero', hero)
      const keys = await listSiteContentKeys()
      setAllKeys(keys)
      alert('Hero da Home salvo!')
    } catch (e: any) {
      alert('Erro ao salvar Hero: ' + (e?.message || String(e)))
    } finally {
      setSaving(false)
    }
  }

  const saveAbout = async () => {
    setSaving(true)
    try {
      await upsertSiteContent('home.about', about)
      const keys = await listSiteContentKeys()
      setAllKeys(keys)
      alert('Sobre (About) salvo!')
    } catch (e: any) {
      alert('Erro ao salvar About: ' + (e?.message || String(e)))
    } finally {
      setSaving(false)
    }
  }

  const savePracticeAreas = async () => {
    setSaving(true)
    try {
      await upsertSiteContent('home.practice_areas', practiceAreas)
      const keys = await listSiteContentKeys()
      setAllKeys(keys)
      alert('Áreas de Atuação salvas!')
    } catch (e: any) {
      alert('Erro ao salvar Áreas: ' + (e?.message || String(e)))
    } finally {
      setSaving(false)
    }
  }

  const saveContact = async () => {
    setSaving(true)
    try {
      await upsertSiteContent('home.contact', contact)
      const keys = await listSiteContentKeys()
      setAllKeys(keys)
      alert('Contato salvo!')
    } catch (e: any) {
      alert('Erro ao salvar Contato: ' + (e?.message || String(e)))
    } finally {
      setSaving(false)
    }
  }

  const loadRaw = async () => {
    setRawError('')
    try {
      const data = await getSiteContent<any>(rawKey)
      setRawJson(data ? JSON.stringify(data, null, 2) : '')
    } catch {
      setRawJson('')
    }
  }

  const saveRaw = async () => {
    setSaving(true)
    setRawError('')
    try {
      let parsed: any = {}
      const trimmed = (rawJson || '').trim()
      if (trimmed) {
        parsed = JSON.parse(trimmed)
      }
      await upsertSiteContent(rawKey, parsed)
      const keys = await listSiteContentKeys()
      setAllKeys(keys)
      alert('Conteúdo salvo!')
    } catch (e: any) {
      const msg = e?.message || String(e)
      if (msg?.toLowerCase()?.includes('json')) setRawError('JSON inválido. Verifique a formatação.')
      else setRawError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-200">Carregando...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gold-500">Site (CMS)</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('header')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'header' ? 'bg-gold-500 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'hero' ? 'bg-gold-500 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Home: Hero
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'about' ? 'bg-gold-500 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Home: Sobre
          </button>
          <button
            onClick={() => setActiveTab('areas')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'areas' ? 'bg-gold-500 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Home: Áreas
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'contact' ? 'bg-gold-500 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Home: Contato
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'footer' ? 'bg-gold-500 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Footer
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'seo' ? 'bg-gold-500 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'raw' ? 'bg-gold-500 text-gray-900' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Avançado (JSON)
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gold-500/20 p-6">
        {activeTab === 'header' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Itens do Menu</h3>
              <div className="space-y-3">
                {headerNav.items.map((it, idx) => (
                  <div key={idx} className="grid md:grid-cols-12 gap-3 items-center">
                    <input
                      value={it.name}
                      onChange={(e) => {
                        const next = [...headerNav.items]
                        next[idx] = { ...next[idx], name: e.target.value }
                        setHeaderNav((p) => ({ ...p, items: next }))
                      }}
                      className="md:col-span-4 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                      placeholder="Nome"
                    />
                    <input
                      value={it.href}
                      onChange={(e) => {
                        const next = [...headerNav.items]
                        next[idx] = { ...next[idx], href: e.target.value }
                        setHeaderNav((p) => ({ ...p, items: next }))
                      }}
                      className="md:col-span-6 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                      placeholder="Link (ex: /#contato)"
                    />
                    <div className="md:col-span-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = headerNav.items.filter((_, i) => i !== idx)
                          setHeaderNav((p) => ({ ...p, items: next }))
                        }}
                        className="w-full px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setHeaderNav((p) => ({ ...p, items: [...p.items, { name: 'Novo item', href: '/' }] }))}
                className="mt-4 px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Adicionar item
              </button>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Botão (CTA)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Texto</label>
                  <input
                    value={headerNav.cta?.label || ''}
                    onChange={(e) => setHeaderNav((p) => ({ ...p, cta: { label: e.target.value, href: p.cta?.href || '/#contato' } }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Link</label>
                  <input
                    value={headerNav.cta?.href || ''}
                    onChange={(e) => setHeaderNav((p) => ({ ...p, cta: { label: p.cta?.label || 'Consulta Aqui', href: e.target.value } }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveHeader}
                disabled={saving}
                className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar Menu'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Texto principal</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Badge</label>
                  <input
                    value={hero.badge_text || ''}
                    onChange={(e) => setHero((p) => ({ ...p, badge_text: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Subtítulo</label>
                  <input
                    value={hero.subheadline || ''}
                    onChange={(e) => setHero((p) => ({ ...p, subheadline: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título (linha 1)</label>
                  <input
                    value={hero.headline_line1 || ''}
                    onChange={(e) => setHero((p) => ({ ...p, headline_line1: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título (destaque)</label>
                  <input
                    value={hero.headline_highlight || ''}
                    onChange={(e) => setHero((p) => ({ ...p, headline_highlight: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Logo</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Logo (src)</label>
                  <input
                    value={hero.logo_src || ''}
                    onChange={(e) => setHero((p) => ({ ...p, logo_src: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    placeholder="/Logo transparente.png"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Logo (alt)</label>
                  <input
                    value={hero.logo_alt || ''}
                    onChange={(e) => setHero((p) => ({ ...p, logo_alt: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Botões (CTAs)</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">CTA 1 - texto</label>
                    <input
                      value={hero.cta_primary?.label || ''}
                      onChange={(e) => setHero((p) => ({ ...p, cta_primary: { label: e.target.value, href: p.cta_primary?.href || '#contato' } }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">CTA 1 - link</label>
                    <input
                      value={hero.cta_primary?.href || ''}
                      onChange={(e) => setHero((p) => ({ ...p, cta_primary: { label: p.cta_primary?.label || '', href: e.target.value } }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">CTA 2 - texto</label>
                    <input
                      value={hero.cta_secondary?.label || ''}
                      onChange={(e) => setHero((p) => ({ ...p, cta_secondary: { label: e.target.value, href: p.cta_secondary?.href || '/#areas' } }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">CTA 2 - link</label>
                    <input
                      value={hero.cta_secondary?.href || ''}
                      onChange={(e) => setHero((p) => ({ ...p, cta_secondary: { label: p.cta_secondary?.label || '', href: e.target.value } }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">CTA 3 - texto</label>
                    <input
                      value={hero.cta_tertiary?.label || ''}
                      onChange={(e) => setHero((p) => ({ ...p, cta_tertiary: { label: e.target.value, href: p.cta_tertiary?.href || '/calculadora' } }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">CTA 3 - link</label>
                    <input
                      value={hero.cta_tertiary?.href || ''}
                      onChange={(e) => setHero((p) => ({ ...p, cta_tertiary: { label: p.cta_tertiary?.label || '', href: e.target.value } }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Imagens (3 cards)</h3>
              <div className="space-y-3">
                {(hero.stats || []).map((st, idx) => (
                  <div key={idx} className="grid md:grid-cols-12 gap-3 items-center">
                    <input
                      value={st.src}
                      onChange={(e) => {
                        const next = [...(hero.stats || [])]
                        next[idx] = { ...next[idx], src: e.target.value }
                        setHero((p) => ({ ...p, stats: next }))
                      }}
                      className="md:col-span-7 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                      placeholder="/Since 2021.png"
                    />
                    <input
                      value={st.alt}
                      onChange={(e) => {
                        const next = [...(hero.stats || [])]
                        next[idx] = { ...next[idx], alt: e.target.value }
                        setHero((p) => ({ ...p, stats: next }))
                      }}
                      className="md:col-span-4 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                      placeholder="Alt"
                    />
                    <div className="md:col-span-1">
                      <button
                        type="button"
                        onClick={() => {
                          const next = (hero.stats || []).filter((_, i) => i !== idx)
                          setHero((p) => ({ ...p, stats: next }))
                        }}
                        className="w-full px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setHero((p) => ({ ...p, stats: [...(p.stats || []), { src: '', alt: '' }] }))}
                className="mt-4 px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Adicionar imagem
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveHero}
                disabled={saving}
                className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar Hero'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Cabeçalho</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título</label>
                  <input
                    value={about.header_title || ''}
                    onChange={(e) => setAbout((p) => ({ ...p, header_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Subtítulo</label>
                  <input
                    value={about.header_subtitle || ''}
                    onChange={(e) => setAbout((p) => ({ ...p, header_subtitle: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Coluna esquerda</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título da seção</label>
                  <input
                    value={about.left_title || ''}
                    onChange={(e) => setAbout((p) => ({ ...p, left_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Frase destaque</label>
                  <input
                    value={about.quote || ''}
                    onChange={(e) => setAbout((p) => ({ ...p, quote: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    placeholder='"Do seu direito, a gente cuida."'
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Parágrafos (1 por linha)</label>
                  <textarea
                    value={(about.paragraphs || []).join('\n')}
                    onChange={(e) => setAbout((p) => ({ ...p, paragraphs: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Bullets (1 por linha)</label>
                  <textarea
                    value={(about.bullets || []).join('\n')}
                    onChange={(e) => setAbout((p) => ({ ...p, bullets: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cards da direita (3)</h3>
              {(about.cards || []).map((c, idx) => (
                <div key={idx} className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Card {idx + 1} - Título</label>
                    <input
                      value={c.title}
                      onChange={(e) => {
                        const next = [...(about.cards || [])]
                        next[idx] = { ...next[idx], title: e.target.value }
                        setAbout((p) => ({ ...p, cards: next }))
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Card {idx + 1} - Texto</label>
                    <textarea
                      value={c.body}
                      onChange={(e) => {
                        const next = [...(about.cards || [])]
                        next[idx] = { ...next[idx], body: e.target.value }
                        setAbout((p) => ({ ...p, cards: next }))
                      }}
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveAbout}
                disabled={saving}
                className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar Sobre'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'areas' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Cabeçalho</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título</label>
                  <input
                    value={practiceAreas.title || ''}
                    onChange={(e) => setPracticeAreas((p) => ({ ...p, title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Subtítulo</label>
                  <input
                    value={practiceAreas.subtitle || ''}
                    onChange={(e) => setPracticeAreas((p) => ({ ...p, subtitle: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cards (áreas)</h3>
              <div className="space-y-4">
                {(practiceAreas.items || []).map((it, idx) => (
                  <div key={idx} className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
                    <div className="grid md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-3">
                        <label className="block text-sm text-gray-300 mb-1">Ícone</label>
                        <select
                          value={it.icon}
                          onChange={(e) => {
                            const next = [...(practiceAreas.items || [])]
                            next[idx] = { ...next[idx], icon: e.target.value as PracticeAreaIcon }
                            setPracticeAreas((p) => ({ ...p, items: next }))
                          }}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                        >
                          <option value="FileText">FileText</option>
                          <option value="Briefcase">Briefcase</option>
                          <option value="Gavel">Gavel</option>
                          <option value="Shield">Shield</option>
                          <option value="Users">Users</option>
                          <option value="Home">Home</option>
                          <option value="Building2">Building2</option>
                          <option value="TrendingUp">TrendingUp</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-sm text-gray-300 mb-1">Tema</label>
                        <select
                          value={it.theme}
                          onChange={(e) => {
                            const next = [...(practiceAreas.items || [])]
                            next[idx] = { ...next[idx], theme: e.target.value as PracticeAreaTheme }
                            setPracticeAreas((p) => ({ ...p, items: next }))
                          }}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                        >
                          <option value="brown">brown</option>
                          <option value="gold">gold</option>
                          <option value="blue">blue</option>
                          <option value="red">red</option>
                        </select>
                      </div>

                      <div className="md:col-span-5">
                        <label className="block text-sm text-gray-300 mb-1">Título</label>
                        <input
                          value={it.title}
                          onChange={(e) => {
                            const next = [...(practiceAreas.items || [])]
                            next[idx] = { ...next[idx], title: e.target.value }
                            setPracticeAreas((p) => ({ ...p, items: next }))
                          }}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <button
                          type="button"
                          onClick={() => {
                            const next = (practiceAreas.items || []).filter((_, i) => i !== idx)
                            setPracticeAreas((p) => ({ ...p, items: next }))
                          }}
                          className="w-full px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                        >
                          X
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                      <textarea
                        value={it.description}
                        onChange={(e) => {
                          const next = [...(practiceAreas.items || [])]
                          next[idx] = { ...next[idx], description: e.target.value }
                          setPracticeAreas((p) => ({ ...p, items: next }))
                        }}
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = [...(practiceAreas.items || [])]
                  next.push({ icon: 'FileText', title: 'Nova área', description: '', theme: 'gold' })
                  setPracticeAreas((p) => ({ ...p, items: next }))
                }}
                className="mt-4 px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Adicionar área
              </button>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">CTA (parte de baixo)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Texto</label>
                  <input
                    value={practiceAreas.cta_text || ''}
                    onChange={(e) => setPracticeAreas((p) => ({ ...p, cta_text: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Botão - texto</label>
                  <input
                    value={practiceAreas.cta_button_label || ''}
                    onChange={(e) => setPracticeAreas((p) => ({ ...p, cta_button_label: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-300 mb-1">Botão - link</label>
                <input
                  value={practiceAreas.cta_button_href || ''}
                  onChange={(e) => setPracticeAreas((p) => ({ ...p, cta_button_href: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  placeholder="#contato"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={savePracticeAreas}
                disabled={saving}
                className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar Áreas'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Cabeçalho</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título</label>
                  <input
                    value={contact.header_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, header_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Subtítulo</label>
                  <input
                    value={contact.header_subtitle || ''}
                    onChange={(e) => setContact((p) => ({ ...p, header_subtitle: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Informações (coluna esquerda)</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título do bloco</label>
                  <input
                    value={contact.info_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, info_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">WhatsApp (número com DDI)</label>
                  <input
                    value={contact.whatsapp_phone || ''}
                    onChange={(e) => setContact((p) => ({ ...p, whatsapp_phone: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    placeholder="5573999348552"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">E-mail destino (envio)</label>
                  <input
                    value={contact.to_email || ''}
                    onChange={(e) => setContact((p) => ({ ...p, to_email: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    placeholder="contato@nevesecosta.com.br"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Localização - título</label>
                  <input
                    value={contact.location_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, location_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Localização - linhas (1 por linha)</label>
                  <textarea
                    value={(contact.location_lines || []).join('\n')}
                    onChange={(e) => setContact((p) => ({ ...p, location_lines: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Telefone - título</label>
                  <input
                    value={contact.phone_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, phone_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Telefones (1 por linha)</label>
                  <textarea
                    value={(contact.phone_lines || []).join('\n')}
                    onChange={(e) => setContact((p) => ({ ...p, phone_lines: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">E-mail - título</label>
                  <input
                    value={contact.email_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, email_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">E-mails (1 por linha)</label>
                  <textarea
                    value={(contact.email_lines || []).join('\n')}
                    onChange={(e) => setContact((p) => ({ ...p, email_lines: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Horário - título</label>
                  <input
                    value={contact.hours_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, hours_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Horário - linhas (1 por linha)</label>
                  <textarea
                    value={(contact.hours_lines || []).join('\n')}
                    onChange={(e) => setContact((p) => ({ ...p, hours_lines: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Caixa informativa (Digital)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título</label>
                  <input
                    value={contact.infobox_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, infobox_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Texto</label>
                  <textarea
                    value={contact.infobox_body || ''}
                    onChange={(e) => setContact((p) => ({ ...p, infobox_body: e.target.value }))}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título da lista</label>
                  <input
                    value={contact.infobox_list_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, infobox_list_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Itens da lista (1 por linha)</label>
                  <textarea
                    value={(contact.infobox_list_items || []).join('\n')}
                    onChange={(e) => setContact((p) => ({ ...p, infobox_list_items: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={5}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-300 mb-1">Frase (quote)</label>
                <input
                  value={contact.infobox_quote || ''}
                  onChange={(e) => setContact((p) => ({ ...p, infobox_quote: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                />
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Formulário</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título do formulário</label>
                  <input
                    value={contact.form_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, form_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Texto do botão</label>
                  <input
                    value={contact.submit_button_label || ''}
                    onChange={(e) => setContact((p) => ({ ...p, submit_button_label: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título de sucesso</label>
                  <input
                    value={contact.success_title || ''}
                    onChange={(e) => setContact((p) => ({ ...p, success_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Mensagem de sucesso</label>
                  <input
                    value={contact.success_message || ''}
                    onChange={(e) => setContact((p) => ({ ...p, success_message: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Label - Nome</label>
                  <input
                    value={contact.name_label || ''}
                    onChange={(e) => setContact((p) => ({ ...p, name_label: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Placeholder - Nome</label>
                  <input
                    value={contact.name_placeholder || ''}
                    onChange={(e) => setContact((p) => ({ ...p, name_placeholder: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Label - E-mail</label>
                  <input
                    value={contact.email_label || ''}
                    onChange={(e) => setContact((p) => ({ ...p, email_label: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Placeholder - E-mail</label>
                  <input
                    value={contact.email_placeholder || ''}
                    onChange={(e) => setContact((p) => ({ ...p, email_placeholder: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Label - Telefone</label>
                  <input
                    value={contact.phone_label || ''}
                    onChange={(e) => setContact((p) => ({ ...p, phone_label: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Placeholder - Telefone</label>
                  <input
                    value={contact.phone_placeholder || ''}
                    onChange={(e) => setContact((p) => ({ ...p, phone_placeholder: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Label - Assunto</label>
                  <input
                    value={contact.subject_label || ''}
                    onChange={(e) => setContact((p) => ({ ...p, subject_label: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Placeholder - Assunto</label>
                  <input
                    value={contact.subject_placeholder || ''}
                    onChange={(e) => setContact((p) => ({ ...p, subject_placeholder: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Label - Mensagem</label>
                  <input
                    value={contact.message_label || ''}
                    onChange={(e) => setContact((p) => ({ ...p, message_label: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Placeholder - Mensagem</label>
                  <input
                    value={contact.message_placeholder || ''}
                    onChange={(e) => setContact((p) => ({ ...p, message_placeholder: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="border-t border-gold-500/20 mt-6 pt-6">
                <h4 className="text-sm font-semibold text-gray-200 mb-3">Opções do select (Assunto)</h4>
                <div className="space-y-3">
                  {(contact.subject_options || []).map((opt, idx) => (
                    <div key={idx} className="grid md:grid-cols-12 gap-3 items-center">
                      <input
                        value={opt.value}
                        onChange={(e) => {
                          const next = [...(contact.subject_options || [])]
                          next[idx] = { ...next[idx], value: e.target.value }
                          setContact((p) => ({ ...p, subject_options: next }))
                        }}
                        className="md:col-span-4 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                        placeholder="valor (ex: civil)"
                      />
                      <input
                        value={opt.label}
                        onChange={(e) => {
                          const next = [...(contact.subject_options || [])]
                          next[idx] = { ...next[idx], label: e.target.value }
                          setContact((p) => ({ ...p, subject_options: next }))
                        }}
                        className="md:col-span-7 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                        placeholder="Label (ex: Direito Civil)"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (contact.subject_options || []).filter((_, i) => i !== idx)
                          setContact((p) => ({ ...p, subject_options: next }))
                        }}
                        className="md:col-span-1 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setContact((p) => ({ ...p, subject_options: [...(p.subject_options || []), { value: 'novo', label: 'Novo assunto' }] }))}
                  className="mt-4 px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
                >
                  Adicionar assunto
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveContact}
                disabled={saving}
                className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar Contato'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Logo e Descrição</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Logo - src</label>
                  <input
                    value={footer.logo_src || ''}
                    onChange={(e) => setFooter((p) => ({ ...p, logo_src: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    placeholder="/Logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Logo - alt</label>
                  <input
                    value={footer.logo_alt || ''}
                    onChange={(e) => setFooter((p) => ({ ...p, logo_alt: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                <textarea
                  value={footer.description || ''}
                  onChange={(e) => setFooter((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                />
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Redes Sociais</h3>
              <div className="space-y-3">
                {(footer.social || []).map((s, idx) => (
                  <div key={idx} className="grid md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-3">
                      <label className="block text-sm text-gray-300 mb-1">Plataforma</label>
                      <select
                        value={s.platform}
                        onChange={(e) => {
                          const next = [...(footer.social || [])]
                          next[idx] = { ...next[idx], platform: e.target.value as FooterSocialPlatform }
                          setFooter((p) => ({ ...p, social: next }))
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                      >
                        <option value="facebook">facebook</option>
                        <option value="instagram">instagram</option>
                        <option value="linkedin">linkedin</option>
                      </select>
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-sm text-gray-300 mb-1">URL</label>
                      <input
                        value={s.url}
                        onChange={(e) => {
                          const next = [...(footer.social || [])]
                          next[idx] = { ...next[idx], url: e.target.value }
                          setFooter((p) => ({ ...p, social: next }))
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-sm text-gray-300 mb-1">Aria-label</label>
                      <input
                        value={s.aria_label || ''}
                        onChange={(e) => {
                          const next = [...(footer.social || [])]
                          next[idx] = { ...next[idx], aria_label: e.target.value }
                          setFooter((p) => ({ ...p, social: next }))
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                        placeholder="Facebook"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <button
                        type="button"
                        onClick={() => {
                          const next = (footer.social || []).filter((_, i) => i !== idx)
                          setFooter((p) => ({ ...p, social: next }))
                        }}
                        className="w-full px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setFooter((p) => ({ ...p, social: [...(p.social || []), { platform: 'facebook', url: '', aria_label: 'Facebook' }] }))}
                className="mt-4 px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Adicionar rede
              </button>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Links Rápidos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título</label>
                  <input
                    value={footer.quick_links_title || ''}
                    onChange={(e) => setFooter((p) => ({ ...p, quick_links_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {(footer.quick_links || []).map((l, idx) => (
                  <div key={idx} className="grid md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-5">
                      <label className="block text-sm text-gray-300 mb-1">Label</label>
                      <input
                        value={l.label}
                        onChange={(e) => {
                          const next = [...(footer.quick_links || [])]
                          next[idx] = { ...next[idx], label: e.target.value }
                          setFooter((p) => ({ ...p, quick_links: next }))
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                      />
                    </div>
                    <div className="md:col-span-6">
                      <label className="block text-sm text-gray-300 mb-1">Href</label>
                      <input
                        value={l.href}
                        onChange={(e) => {
                          const next = [...(footer.quick_links || [])]
                          next[idx] = { ...next[idx], href: e.target.value }
                          setFooter((p) => ({ ...p, quick_links: next }))
                        }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                        placeholder="/ ou #contato"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <button
                        type="button"
                        onClick={() => {
                          const next = (footer.quick_links || []).filter((_, i) => i !== idx)
                          setFooter((p) => ({ ...p, quick_links: next }))
                        }}
                        className="w-full px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setFooter((p) => ({ ...p, quick_links: [...(p.quick_links || []), { label: 'Novo link', href: '/' }] }))}
                className="mt-4 px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Adicionar link
              </button>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Áreas de Atuação</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título</label>
                  <input
                    value={footer.practice_areas_title || ''}
                    onChange={(e) => setFooter((p) => ({ ...p, practice_areas_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Itens (1 por linha)</label>
                  <textarea
                    value={(footer.practice_areas || []).join('\n')}
                    onChange={(e) => setFooter((p) => ({ ...p, practice_areas: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={5}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contato (Footer)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título</label>
                  <input
                    value={footer.contact_title || ''}
                    onChange={(e) => setFooter((p) => ({ ...p, contact_title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Localização (1 por linha)</label>
                  <textarea
                    value={(footer.contact_location_lines || []).join('\n')}
                    onChange={(e) => setFooter((p) => ({ ...p, contact_location_lines: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={5}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Telefones (1 por linha)</label>
                  <textarea
                    value={(footer.contact_phone_lines || []).join('\n')}
                    onChange={(e) => setFooter((p) => ({ ...p, contact_phone_lines: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={5}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">E-mails (1 por linha)</label>
                  <textarea
                    value={(footer.contact_email_lines || []).join('\n')}
                    onChange={(e) => setFooter((p) => ({ ...p, contact_email_lines: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                    rows={5}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gold-500/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Texto final (Copyright)</h3>
              <p className="text-xs text-gray-400 mb-2">Use {`{year}`} para inserir o ano automaticamente. Ex: &amp;copy; {`{year}`} ...</p>
              <input
                value={footer.copyright_text || ''}
                onChange={(e) => setFooter((p) => ({ ...p, copyright_text: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
              />

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Produzido por - Nome</label>
                  <input
                    value={footer.producer_name || ''}
                    onChange={(e) => setFooter((p) => ({ ...p, producer_name: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    placeholder="Nome/Empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Produzido por - Link (opcional)</label>
                  <input
                    value={footer.producer_url || ''}
                    onChange={(e) => setFooter((p) => ({ ...p, producer_url: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveFooter}
                disabled={saving}
                className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar Footer'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Título padrão</label>
              <input
                value={seo.title_default || ''}
                onChange={(e) => setSeo((p) => ({ ...p, title_default: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Template do título</label>
              <input
                value={seo.title_template || ''}
                onChange={(e) => setSeo((p) => ({ ...p, title_template: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Descrição</label>
              <textarea
                value={seo.description || ''}
                onChange={(e) => setSeo((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Keywords (1 por linha)</label>
              <textarea
                value={(seo.keywords || []).join('\n')}
                onChange={(e) => setSeo((p) => ({ ...p, keywords: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                rows={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">OpenGraph imagem</label>
                <input
                  value={seo.og_image || ''}
                  onChange={(e) => setSeo((p) => ({ ...p, og_image: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  placeholder="/Logo transparente.png"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Twitter imagem</label>
                <input
                  value={seo.twitter_image || ''}
                  onChange={(e) => setSeo((p) => ({ ...p, twitter_image: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  placeholder="/Logo transparente.png"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveSeo}
                disabled={saving}
                className="px-6 py-3 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar SEO'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Key</label>
                <input
                  value={rawKey}
                  onChange={(e) => setRawKey(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                  placeholder="ex: header.nav"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={loadRaw}
                  className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
                >
                  Carregar
                </button>
                <button
                  type="button"
                  onClick={saveRaw}
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600 disabled:opacity-60"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">{rawHint}</p>

            <textarea
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              rows={14}
              className="w-full font-mono text-sm bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
              placeholder="{}"
            />

            {rawError && (
              <div className="text-red-300 text-sm">{rawError}</div>
            )}

            <div className="border-t border-gold-500/20 pt-4">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">Keys existentes</h4>
              {allKeys.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhuma key encontrada ainda (crie uma e salve).</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allKeys.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => { setRawKey(k); setRawJson(''); setRawError('') }}
                      className="px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-sm hover:bg-gray-600"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Se você ainda não criou a tabela no Supabase, execute o arquivo <span className="text-gray-200">supabase-site-content.sql</span> no SQL Editor.
      </div>
    </div>
  )
}
