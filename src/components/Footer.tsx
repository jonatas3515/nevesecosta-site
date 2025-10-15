import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gold-500/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="mb-4">
              <Image
                src="/Logo.jpg"
                alt="Neves & Costa Advocacia"
                width={180}
                height={60}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Do seu direito, a gente cuida. Advocacia 100% digital do Extremo Sul da Bahia para todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/jonatas.donascimento"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#fbbf24] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/neves.e.costa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#fbbf24] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#fbbf24] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="#areas" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Áreas de Atuação
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Áreas de Atuação */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Áreas de Atuação</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Direito Civil</li>
              <li>Direito Trabalhista</li>
              <li>Direito Previdenciário</li>
              <li>Direito do Consumidor</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-gold-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Extremo Sul da Bahia<br />
                  Atendimento 100% Digital<br />
                  Atuação em todo o Brasil
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-gold-500 flex-shrink-0" />
                <div className="text-gray-400">
                  <div>(73) 99934-8552</div>
                  <div>(73) 98862-0915</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-gold-500 mt-1 flex-shrink-0" />
                <div className="text-gray-400">
                  <div>nevesecosta.esc@gmail.com</div>
                  <div>contato@nevesecosta.com.br</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-500/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Neves & Costa Advocacia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
