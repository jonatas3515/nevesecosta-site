import React from 'react'

type Props = { data: Record<string, any> }

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // Importante: usar dangerouslySetInnerHTML para serializar JSON-LD corretamente
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
