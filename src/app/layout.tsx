import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neves & Costa Advocacia | Do Seu Direito, A Gente Cuida',
  description: 'Escritório de advocacia 100% digital do Extremo Sul da Bahia. Especializado em Direito Civil, Trabalhista, Previdenciário e do Consumidor. Atendimento em todo o Brasil.',
  keywords: 'advocacia, advogado, direito, jurídico, Bahia, advocacia digital, direito civil, direito trabalhista, direito previdenciário, direito do consumidor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
