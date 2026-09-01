// Tipos do Assistente com IA

export type ChatMessage = {
  role: 'user' | 'model'
  text: string
}

export type LeadData = {
  nome: string
  whatsapp: string
  area: string
  resumo: string
  arquivo?: string
}

export type ChatApiRequest = {
  messages: ChatMessage[]
  userMessage: string
  leadData: Partial<LeadData>
}

export type ChatApiResponse = {
  reply: string
  leadData: Partial<LeadData>
  leadComplete: boolean
  whatsappLink?: string
  leadSaved?: boolean
  error?: string
}
