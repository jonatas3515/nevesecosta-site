import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, telefone, email, area, tipo, resumo, arquivos } = body

    // Lista de anexos (URLs públicas quando houver)
    const arquivosList = Array.isArray(arquivos)
      ? arquivos
          .filter((a: any) => !!a?.url)
          .map((a: any) => `• ${a.nome}: ${a.url}`)
          .join('\n')
      : ''

    // Gerar brief formatado para WhatsApp (igual ao Assistente)
    const brief = `🤝 Olá N&C! Sou ${(nome || '').split(' ')[0] || 'Cliente'}.

📇 Dados do contato
• 👤 Nome: ${nome || 'Não informado'}
• 📱 WhatsApp: ${telefone || 'Não informado'}
${email ? `• ✉️ E-mail: ${email}\n` : ''}• ⚖️ Área: ${area || 'Não informado'}
• 🎯 Tipo: ${tipo || 'Não informado'}

📝 Resumo
${(resumo || 'Não informado').substring(0, 1000)}${(resumo || '').length > 1000 ? '...' : ''}

📎 Anexos: ${(arquivos?.length || 0)} arquivo(s)
${arquivosList ? `${arquivosList}\n\n` : ''}✅ Autorizo o uso dos dados para atendimento jurídico.`

    // Número WhatsApp do escritório (pode ser configurado via env)
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '557391225215'

    // Gerar link wa.me
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(brief)}`

    return NextResponse.json({
      success: true,
      whatsappLink,
      brief
    })

  } catch (error) {
    console.error('Erro ao gerar link WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar link WhatsApp' },
      { status: 500 }
    )
  }
}

// Suporte para GET também (para testes)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const nome = searchParams.get('nome') || 'Cliente'
  const telefone = searchParams.get('telefone') || 'Não informado'
  const email = searchParams.get('email') || 'Não informado'
  const area = searchParams.get('area') || 'Não informado'
  const tipo = searchParams.get('tipo') || 'Não informado'
  const resumo = searchParams.get('resumo') || 'Não informado'

  const brief = `Olá N&C! Sou ${nome}.
Contato: ${telefone} | ${email}
Área: ${area} | Tipo: ${tipo}
Resumo: ${resumo.substring(0, 700)}${resumo.length > 700 ? '...' : ''}
Anexos: 0 arquivo(s)
Autorizo o uso dos dados para atendimento jurídico.`

  const whatsappNumber = process.env.WHATSAPP_NUMBER || '557391225215'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(brief)}`

  return NextResponse.json({
    success: true,
    whatsappLink,
    brief
  })
}
