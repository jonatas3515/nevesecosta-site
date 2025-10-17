import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Áreas de Atuação • Neves & Costa',
  description: 'Direito Civil, Trabalhista, Previdenciário e do Consumidor. Conheça como atuamos em cada área.',
  alternates: { canonical: '/areas' },
}

export default function AreasLayout({ children }: { children: React.ReactNode }) {
  return children
}
