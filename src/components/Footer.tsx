import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'
import { getSiteContentServer } from '@/lib/siteContentServer'

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

const defaultFooter: Required<FooterData> = {
  logo_src: '/logo.png',
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
  contact_phone_lines: ['(73) 9122-5215', '(73) 98862-0915'],
  contact_email_lines: ['nevesecosta.esc@gmail.com', 'contato@nevesecosta.com.br'],

  copyright_text: '&copy; {year} Neves & Costa Advocacia. Todos os direitos reservados.',
  producer_name: '',
  producer_url: '',
}

export default async function Footer() {
  const footerData = await getSiteContentServer<FooterData>('footer')
  const footer: FooterData = {
    ...defaultFooter,
    ...(footerData || {}),
    social: Array.isArray(footerData?.social) ? footerData?.social : defaultFooter.social,
    quick_links: Array.isArray(footerData?.quick_links) ? footerData?.quick_links : defaultFooter.quick_links,
    practice_areas: Array.isArray(footerData?.practice_areas) ? footerData?.practice_areas : defaultFooter.practice_areas,
    contact_location_lines: Array.isArray(footerData?.contact_location_lines)
      ? footerData?.contact_location_lines
      : defaultFooter.contact_location_lines,
    contact_phone_lines: Array.isArray(footerData?.contact_phone_lines)
      ? footerData?.contact_phone_lines
      : defaultFooter.contact_phone_lines,
    contact_email_lines: Array.isArray(footerData?.contact_email_lines)
      ? footerData?.contact_email_lines
      : defaultFooter.contact_email_lines,
  }

  const year = new Date().getFullYear()
  const copyrightText = String(footer.copyright_text || defaultFooter.copyright_text).replace(
    '{year}',
    String(year)
  )

  const rawLogoSrc = String(footer.logo_src || defaultFooter.logo_src)
  const normalizedSrc = rawLogoSrc === '/Logo.png' ? '/logo.png' : rawLogoSrc
  const logoSrc = /\/logo\.jpg$/i.test(normalizedSrc) ? '/logo.png' : normalizedSrc

  const socialIconMap: Record<FooterSocialPlatform, any> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
  }

  return (
    <footer className="bg-black text-white border-t border-gold-500/20" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="mb-4">
              <Image
                src={logoSrc}
                alt={footer.logo_alt || defaultFooter.logo_alt}
                width={180}
                height={60}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-4">
              {footer.description || defaultFooter.description}
            </p>
            <div className="flex space-x-4">
              {(footer.social || []).filter((s) => s?.url).map((s, idx) => {
                const Icon = socialIconMap[s.platform]
                if (!Icon) return null
                return (
                  <a
                    key={`${s.platform}-${idx}`}
                    href={s.url}
                    target={s.url?.startsWith('http') ? '_blank' : undefined}
                    rel={s.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-[#fbbf24] transition-colors"
                    aria-label={s.aria_label || s.platform}
                  >
                    <Icon size={24} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Rápidos */}
          <nav aria-label="Links rápidos">
            <h3 className="text-lg font-semibold mb-4">{footer.quick_links_title || defaultFooter.quick_links_title}</h3>
            <ul className="space-y-2">
              {(footer.quick_links || []).filter((l) => l?.href && l?.label).map((l, idx) => (
                <li key={idx}>
                  <Link href={l.href} className="text-gray-400 hover:text-gold-500 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Áreas de Atuação */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{footer.practice_areas_title || defaultFooter.practice_areas_title}</h3>
            <ul className="space-y-2 text-gray-400">
              {(footer.practice_areas || []).map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <address className="not-italic">
            <h3 className="text-lg font-semibold mb-4">{footer.contact_title || defaultFooter.contact_title}</h3>
            <ul className="space-y-3" aria-label="Informações de contato">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-gold-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  {(footer.contact_location_lines || []).map((ln, idx) => (
                    <span key={idx}>
                      {ln}
                      <br />
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-gold-500 flex-shrink-0" />
                <div className="text-gray-400">
                  {(footer.contact_phone_lines || []).map((ln, idx) => (
                    <div key={idx}>{ln}</div>
                  ))}
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-gold-500 mt-1 flex-shrink-0" />
                <div className="text-gray-400">
                  {(footer.contact_email_lines || []).map((ln, idx) => (
                    <div key={idx}>{ln}</div>
                  ))}
                </div>
              </li>
            </ul>
          </address>
        </div>

        <div className="border-t border-gold-500/20 mt-8 pt-8 text-center text-gray-400">
          <p dangerouslySetInnerHTML={{ __html: copyrightText }} />
          <p className="mt-2 flex items-center justify-center gap-2">
            Desenvolvido por
            <Image
              src="/JNC.png"
              alt="JNC"
              width={32}
              height={32}
              className="h-6 w-auto inline-block"
            />
          </p>
        </div>
      </div>
    </footer>
  )
}
