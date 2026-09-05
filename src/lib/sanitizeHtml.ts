import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitiza HTML de posts do blog contra XSS.
 * Usa allowlist explícita e mínima para tags e atributos editoriais.
 * 
 * @param dirtyHtml - HTML não sanitizado
 * @returns HTML sanitizado e seguro
 */
export function sanitizeBlogHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return ''
  }

  const config = {
    ALLOWED_TAGS: [
      'p', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark',
      'ul', 'ol', 'li',
      'blockquote',
      'pre', 'code',
      'a',
      'img',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'figure', 'figcaption',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      // Globais editoriais
      'class', 'id',
      // Links
      'href', 'title', 'target', 'rel',
      // Imagens
      'src', 'alt', 'width', 'height', 'loading',
      // Tabelas
      'colspan', 'rowspan', 'scope',
      // Acessibilidade
      'aria-label', 'aria-hidden'
    ],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
    FORCE_BODY: false,
    SANITIZE_DOM: true,
    IN_PLACE: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    SAFE_FOR_TEMPLATES: false,
    WHOLE_DOCUMENT: false
  }

  let clean = DOMPurify.sanitize(dirtyHtml, config)

  // Garantir rel="noopener noreferrer" em links com target="_blank"
  clean = clean.replace(
    /<a\s+([^>]*?)target="_blank"([^>]*?)>/gi,
    (match, before, after) => {
      // Se já tem rel, não adicionar
      if (/rel=["']/.test(match)) {
        return match
      }
      return `<a ${before}target="_blank" rel="noopener noreferrer"${after}>`
    }
  )

  return clean
}
