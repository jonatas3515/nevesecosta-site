import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import JsonLd from '@/components/seo/JsonLd'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.nevesecosta.com.br'),
  title: {
    default: 'Neves & Costa Advocacia e Consultoria',
    template: '%s • Neves & Costa',
  },
  description: 'Escritório de advocacia do Extremo Sul da Bahia. Direito Civil, Trabalhista, Previdenciário e do Consumidor. Atendimento em todo o Brasil.',
  keywords: ['advocacia', 'advogado', 'direito', 'Bahia', 'Itamaraju', 'direito civil', 'direito trabalhista', 'direito previdenciário', 'direito do consumidor'],
  alternates: {
    canonical: '/',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: 'website',
    url: 'https://www.nevesecosta.com.br/',
    siteName: 'Neves & Costa',
    title: 'Neves & Costa Advocacia e Consultoria',
    description: 'Do seu direito, a gente cuida. Atuação em Civil, Trabalhista, Previdenciário e do Consumidor.',
    images: [
      {
        url: 'https://i.im.ge/2025/10/18/nRo1MP.Logo-transparente.png',
        width: 1200,
        height: 630,
        alt: 'Neves & Costa Advocacia e Consultoria',
      },
    ],
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neves & Costa Advocacia e Consultoria',
    description: 'Do seu direito, a gente cuida.',
    images: ['https://i.im.ge/2025/10/18/nRo1MP.Logo-transparente.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Neves & Costa Advocacia e Consultoria',
            url: 'https://www.nevesecosta.com.br',
            logo: 'https://i.im.ge/2025/10/18/nRo1MP.Logo-transparente.png',
            image: 'https://i.im.ge/2025/09/28/nmeA40.Rua-Pesidente-Kennedy-n-72-A-centro.jpeg',
            sameAs: ['https://instagram.com/neves.e.costa'],
            contactPoint: [
              { '@type': 'ContactPoint', telephone: '+55-73-99934-8552', contactType: 'customer service', areaServed: 'BR' },
              { '@type': 'ContactPoint', telephone: '+55-73-98862-0915', contactType: 'customer service', areaServed: 'BR' },
              { '@type': 'ContactPoint', telephone: '+55-73-99122-5215', contactType: 'customer service', areaServed: 'BR' },
            ],
            address: [
              {
                '@type': 'PostalAddress',
                streetAddress: 'Rua Palmeiras, 105, Novo Prado',
                addressLocality: 'Itamaraju',
                addressRegion: 'BA',
                postalCode: '45836-000',
                addressCountry: 'BR',
              },
              {
                '@type': 'PostalAddress',
                streetAddress: 'Rua Presidente Kennedy, 72-A, Centro',
                addressLocality: 'Itamaraju',
                addressRegion: 'BA',
                postalCode: '45836-000',
                addressCountry: 'BR',
              },
            ],
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
