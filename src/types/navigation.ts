/**
 * Tipos relacionados à navegação do site
 */

export type NavItem = {
  name: string
  href: string
}

export type CtaButton = {
  label: string
  href: string
}

export type HeaderNavData = {
  items?: NavItem[]
  cta?: { label?: string; href?: string }
}
