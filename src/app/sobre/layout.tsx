import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre • Neves & Costa',
  description: 'Conheça a Neves & Costa Advocacia e Consultoria: propósito, valores e forma de atuação em defesa dos seus direitos.',
  alternates: { canonical: '/sobre' },
}

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return children
}
