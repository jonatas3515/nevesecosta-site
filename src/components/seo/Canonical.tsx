"use client"
import { usePathname } from 'next/navigation'

export default function Canonical() {
  const pathname = usePathname() || '/'
  const base = 'https://www.nevesecosta.com.br'
  const href = `${base}${pathname}`
  return <link rel="canonical" href={href} />
}
