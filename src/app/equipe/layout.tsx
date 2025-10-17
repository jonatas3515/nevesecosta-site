import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nossa Equipe • Neves & Costa',
  description: 'Conheça os advogados da Neves & Costa Advocacia e Consultoria e suas áreas de atuação.',
  alternates: { canonical: '/equipe' },
}

export default function EquipeLayout({ children }: { children: React.ReactNode }) {
  return children
}
