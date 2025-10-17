import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consulta de Processos • Neves & Costa',
  description: 'Acesse rapidamente os sistemas oficiais dos tribunais para consultar seu processo online.',
  alternates: { canonical: '/consulta-processo' },
}

export default function ConsultaProcessoLayout({ children }: { children: React.ReactNode }) {
  return children
}
