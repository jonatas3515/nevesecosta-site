import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Rescisão • Neves & Costa',
  description: 'Calcule valores aproximados da sua rescisão trabalhista gratuitamente com nossa calculadora.',
  alternates: { canonical: '/calculadora' },
}

export default function CalculadoraLayout({ children }: { children: React.ReactNode }) {
  return children
}
