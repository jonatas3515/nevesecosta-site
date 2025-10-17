import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Jurídico • Artigos e Orientações',
  description: 'Conteúdo jurídico produzido pela Neves & Costa Advocacia e Consultoria. Notícias, artigos e orientações práticas.',
  alternates: { canonical: '/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
