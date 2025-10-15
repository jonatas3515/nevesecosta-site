'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
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
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.jpg"
              alt="Neves & Costa Advocacia"
              width={180}
              height={60}
              className="h-12 w-auto md:h-14"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
            href="/#contato"
            className="hidden md:block bg-[#fbbf24] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-colors"
          >
            Consulta Gratuita
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
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
              href="/#contato"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block bg-[#fbbf24] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-colors text-center"
            >
              Consulta Gratuita
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
