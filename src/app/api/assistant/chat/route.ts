import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const GEMINI_MODEL = 'gemini-2.5-flash-lite'

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '557391225215'

// Rate limiting simples por IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 15 // max requests
const RATE_WINDOW = 60_000 // per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// System prompt com todo o contexto do escritório
const SYSTEM_PROMPT = `Você é o assistente virtual inteligente do escritório **Neves & Costa Advocacia e Consultoria** (N&C Advocacia). Seu objetivo é atender os visitantes do site de forma acolhedora, profissional e eficiente.

## Sobre o Escritório
- **Nome:** Neves & Costa Advocacia e Consultoria (N&C Advocacia)
- **Slogan:** "Do seu direito, a gente cuida!"
- **Localização:** Itamaraju, Extremo Sul da Bahia
- **Endereço 1:** Rua Palmeiras, 105, Novo Prado – Itamaraju/BA, CEP 45836-000
- **Endereço 2:** Rua Presidente Kennedy, 72-A, Centro – Itamaraju/BA, CEP 45836-000
- **WhatsApp:** (73) 9122-5215
- **Instagram:** @neves.e.costa
- **Atendimento:** Presencial e online para todo o Brasil

## Áreas de Atuação
1. **Direito Civil** – Contratos, cobranças, indenizações, posse, usucapião, obrigações
2. **Direito Trabalhista** – Rescisões, horas extras, verbas não pagas, acidentes de trabalho
3. **Direito Previdenciário** – Aposentadorias, pensões, auxílios INSS, revisão de benefícios
4. **Direito do Consumidor** – Cobranças abusivas, compras online, planos de saúde, serviços
5. **Direito Criminal** – Defesa em processos criminais
6. **Direito de Família** – Divórcio, guarda, pensão alimentícia, inventário
7. **Direito Tributário** – Questões fiscais e tributárias

## AVISO IMPORTANTE — "Advocacia Neves Costa"
Se o cliente mencionar boletos, cobranças bancárias, financeiras ou "Advocacia Neves Costa":
- Informe que **N&C Advocacia NÃO emite boletos** e NÃO realiza cobranças relacionadas a bancos ou financeiras
- N&C Advocacia **NÃO possui CNPJ**
- A empresa "Advocacia Neves Costa" é **DIFERENTE** de N&C Advocacia — não há qualquer relação
- Oriente o cliente a buscar o contato correto da empresa responsável por meio de pesquisa direta pelo CNPJ informado no documento

## Suas Instruções
1. Seja sempre educado, empático e profissional. Use emojis com moderação.
2. Responda perguntas sobre o escritório, áreas de atuação, localização, contato etc.
3. Durante a conversa, colete naturalmente as seguintes informações do cliente:
   - **Nome completo**
   - **WhatsApp (com DDD)**
   - **Área do direito** relacionada ao caso
   - **Resumo do caso** (breve descrição da situação)
4. NÃO peça todas as informações de uma vez. Colete de forma conversacional e natural.
5. Quando o cliente descrever seu problema, tente classificar a área jurídica automaticamente.
6. Mantenha respostas curtas e objetivas (máx. 3–4 frases por mensagem).

## Formato de Resposta
Você DEVE responder SEMPRE em formato JSON válido com a seguinte estrutura:
{
  "reply": "Sua resposta ao cliente aqui",
  "extracted": {
    "nome": "nome extraído ou null",
    "whatsapp": "whatsapp extraído ou null",
    "area": "área jurídica identificada ou null",
    "resumo": "resumo do caso ou null"
  }
}

Regras para o campo "extracted":
- Preencha apenas com dados que o cliente EXPLICITAMENTE informou na conversa
- Use null para dados que ainda não foram informados
- Para "area", use uma das categorias: "Cível", "Trabalhista", "Previdenciário", "Consumidor", "Criminal", "Família", "Tributário", "Outros"
- Para "resumo", monte um resumo conciso do caso baseado no que o cliente descreveu
- O "whatsapp" deve conter apenas números (com DDD), ex: "73999348552"

IMPORTANTE: Sua resposta deve ser APENAS o JSON, sem markdown, sem backticks, sem texto adicional.`

type GeminiContent = {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export async function POST(request: NextRequest) {
  try {
    // Read API key at request time (not module-load time)
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing or empty')
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada no servidor.' },
        { status: 500 }
      )
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

    // Rate limit
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Muitas requisições. Aguarde um momento.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { messages = [], userMessage, leadData = {} } = body

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return NextResponse.json({ error: 'Mensagem vazia.' }, { status: 400 })
    }

    if (userMessage.length > 2000) {
      return NextResponse.json({ error: 'Mensagem muito longa (máx. 2000 caracteres).' }, { status: 400 })
    }

    // Montar histórico para Gemini (máx. 20 mensagens)
    const historySlice = messages.slice(-20)
    const geminiHistory: GeminiContent[] = historySlice.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }))

    // Appending context about already collected data
    let contextNote = ''
    if (leadData.nome || leadData.whatsapp || leadData.area || leadData.resumo) {
      contextNote = `\n\n[CONTEXTO INTERNO - dados já coletados até agora: nome=${leadData.nome || 'não informado'}, whatsapp=${leadData.whatsapp || 'não informado'}, area=${leadData.area || 'não informada'}, resumo=${leadData.resumo || 'não informado'}. Use essas informações para não perguntar novamente o que já sabe.]`
    }

    // Add user message to history
    geminiHistory.push({
      role: 'user',
      parts: [{ text: userMessage + contextNote }],
    })

    // Call Gemini API
    const geminiPayload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: geminiHistory,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 512,
      },
    }

    console.log('[Gemini] Sending request to:', GEMINI_MODEL)

    // Retry logic for rate limiting (429)
    let geminiRes: Response | null = null
    const MAX_RETRIES = 2
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      })

      if (geminiRes.status === 429 && attempt < MAX_RETRIES) {
        const waitMs = (attempt + 1) * 2000 // 2s, 4s
        console.log(`[Gemini] Rate limited (429), retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`)
        await new Promise(resolve => setTimeout(resolve, waitMs))
        continue
      }
      break
    }

    if (!geminiRes || !geminiRes.ok) {
      const errText = geminiRes ? await geminiRes.text() : 'No response'
      const status = geminiRes?.status || 0
      console.error('[Gemini] API error:', status, errText)

      if (status === 429) {
        return NextResponse.json(
          { error: 'A IA está com muitas requisições no momento. Aguarde alguns segundos e tente novamente. ⏳' },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: `Erro ao comunicar com a IA (${status}). Tente novamente.` },
        { status: 502 }
      )

    }


    const geminiData = await geminiRes.json()
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Parse Gemini response (JSON)
    let reply = ''
    let extracted: Record<string, string | null> = {}

    try {
      // Clean potential markdown wrapping
      let cleanJson = rawText.trim()
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
      }
      const parsed = JSON.parse(cleanJson)
      reply = parsed.reply || ''
      extracted = parsed.extracted || {}
    } catch {
      // If JSON parsing fails, use raw text as reply
      reply = rawText.trim()
      extracted = {}
    }

    // Merge extracted data with existing lead data
    const updatedLead = {
      nome: extracted.nome || leadData.nome || '',
      whatsapp: extracted.whatsapp || leadData.whatsapp || '',
      area: extracted.area || leadData.area || '',
      resumo: extracted.resumo || leadData.resumo || '',
      arquivo: leadData.arquivo || '',
    }

    // Check if lead is complete
    const leadComplete = !!(
      updatedLead.nome.trim() &&
      updatedLead.whatsapp.trim() &&
      updatedLead.area.trim() &&
      updatedLead.resumo.trim()
    )

    let whatsappLink: string | undefined
    let leadSaved = false

    if (leadComplete) {
      // Generate WhatsApp link
      const brief =
        `Olá, gostaria de atendimento.\n\n` +
        `👤 *Nome:* ${updatedLead.nome}\n` +
        `📞 *WhatsApp:* ${updatedLead.whatsapp}\n` +
        `⚖️ *Área:* ${updatedLead.area}\n` +
        (updatedLead.resumo ? `\n📝 *Resumo:* ${updatedLead.resumo}\n` : '') +
        (updatedLead.arquivo ? `📎 *Arquivo:* ${updatedLead.arquivo}\n` : '')

      whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(brief.normalize('NFC'))}`

      // Save lead to Supabase
      try {
        const { error: insertError } = await supabaseAdmin
          .from('leads')
          .insert({
            nome: updatedLead.nome.trim(),
            telefone: updatedLead.whatsapp.replace(/\D/g, '').trim(),
            area: updatedLead.area.trim(),
            tipo: 'assistente-ia',
            resumo: updatedLead.resumo.trim(),
            arquivos: updatedLead.arquivo ? [{ url: updatedLead.arquivo }] : [],
            aceite_lgpd: true,
            status: 'novo',
          })

        if (insertError) {
          console.error('Erro ao salvar lead:', insertError)
        } else {
          leadSaved = true
        }
      } catch (dbErr) {
        console.error('Exceção ao salvar lead:', dbErr)
      }
    }

    return NextResponse.json({
      reply,
      leadData: updatedLead,
      leadComplete,
      whatsappLink,
      leadSaved,
    })
  } catch (error: any) {
    console.error('Erro no assistant/chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
