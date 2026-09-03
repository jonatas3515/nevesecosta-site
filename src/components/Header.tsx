'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { getSiteContent } from '@/lib/siteContent'
import type { NavItem, HeaderNavData } from '@/types/navigation'

const defaultNavItems: NavItem[] = [
  { name: 'Início', href: '/' },
  { name: 'Sobre', href: '/#sobre' },
  { name: 'Equipe', href: '/equipe' },
  { name: 'Áreas de Atuação', href: '/#areas' },
  { name: 'Calculadora', href: '/calculadora' },
  { name: 'Consulta Processo', href: '/consulta-processo' },
  { name: 'Blog', href: '/blog' },
  { name: 'Avaliações', href: '/#avaliacoes' },
  { name: 'Contato', href: '/#contato' },
]

const defaultCta = { label: 'Consulta Aqui', href: '/#contato' }

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems)
  const [cta, setCta] = useState(defaultCta)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let mounted = true
    const loadNav = async () => {
      const data = await getSiteContent<HeaderNavData>('header.nav')
      if (!mounted || !data) return

      if (Array.isArray(data.items)) {
        const clean = data.items
          .filter((it) => it && typeof it.name === 'string' && typeof it.href === 'string')
          .map((it) => { const h = it.href.trim(); return { name: it.name.trim(), href: h.startsWith('/') || h.startsWith('http') ? h : '/' + h } })
          .filter((it) => it.name && it.href)
        if (clean.length > 0) setNavItems(clean)
      }

      const label = data.cta?.label?.trim()
      const href = data.cta?.href?.trim()
      if (label && href) setCta({ label, href })
    }
    loadNav()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black shadow-lg py-3'
          : 'bg-black/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Ir para página inicial">
            <Image
              src="/Logo transparente.png"
              alt="Neves & Costa Advocacia"
              width={220}
              height={80}
              className="h-14 w-auto md:h-16"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium transition-colors text-white hover:text-[#fbbf24]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Link
            href={cta.href}
            className="hidden md:block bg-[#fbbf24] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-colors"
          >
            {cta.label}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4" aria-label="Menu mobile">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-medium transition-colors text-white hover:text-[#fbbf24]"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={cta.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block bg-[#fbbf24] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-colors text-center"
            >
              {cta.label}
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
