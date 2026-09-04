import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return supabaseAdmin
}

const PUBLIC_ERROR = 'Não foi possível enviar seus dados agora.'
const SERVER_ERROR = 'Não foi possível processar sua solicitação.'

const VALID_STATUSES = ['novo', 'contatado', 'em análise', 'concluído']

function isUuid(value: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const allowedKeys = new Set([
      'nome', 'telefone', 'email', 'area', 'tipo', 'resumo', 'arquivos', 'aceite_lgpd', 'origem'
    ])
    for (const key of Object.keys(body)) {
      if (!allowedKeys.has(key)) {
        return NextResponse.json({ error: PUBLIC_ERROR }, { status: 400 })
      }
    }

    const { nome, telefone, email, area, tipo, resumo, arquivos, aceite_lgpd, origem } = body

    if (!nome || !telefone || !area || !tipo || !aceite_lgpd) {
      return NextResponse.json({ error: PUBLIC_ERROR }, { status: 400 })
    }

    const cleanPhone = String(telefone).replace(/\D/g, '')
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      return NextResponse.json({ error: PUBLIC_ERROR }, { status: 400 })
    }

    if (email !== undefined && email !== null && String(email).trim() !== '') {
      if (String(email).length > 320 || !String(email).includes('@')) {
        return NextResponse.json({ error: PUBLIC_ERROR }, { status: 400 })
      }
    }

    let sanitizedFiles: any[] = []
    if (arquivos !== undefined && arquivos !== null) {
      if (!Array.isArray(arquivos) || arquivos.length > 10) {
        return NextResponse.json({ error: PUBLIC_ERROR }, { status: 400 })
      }
      sanitizedFiles = arquivos.slice(0, 10).map((it: any) => {
        if (typeof it === 'string') return String(it).slice(0, 500)
        if (it && typeof it === 'object') {
          const cleaned: Record<string, any> = {}
          for (const [k, v] of Object.entries(it).slice(0, 5)) {
            if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
              cleaned[k] = typeof v === 'string' ? v.slice(0, 500) : v
            }
          }
          return cleaned
        }
        return String(it)
      })
    }

    const leadData = {
      nome: String(nome).trim().slice(0, 200),
      telefone: cleanPhone.slice(0, 15),
      email: email ? String(email).trim().slice(0, 320) : null,
      area: String(area).trim().slice(0, 120),
      tipo: String(tipo).trim().slice(0, 120),
      resumo: resumo ? String(resumo).trim().slice(0, 4000) : null,
      arquivos: sanitizedFiles,
      aceite_lgpd: Boolean(aceite_lgpd),
      status: 'novo',
      origem: origem ? String(origem).trim().slice(0, 50) : 'site'
    }

    const { data, error } = await getSupabaseAdmin()
      .from('leads')
      .insert(leadData)
      .select('id')
      .single()

    if (error) {
      console.error('Erro ao inserir lead:', error)
      return NextResponse.json({ error: PUBLIC_ERROR }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Erro inesperado na API de leads:', error)
    return NextResponse.json({ error: PUBLIC_ERROR }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await getSupabaseAdmin().auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await getSupabaseAdmin()
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 })
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || !status || typeof id !== 'string' || typeof status !== 'string') {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    if (!isUuid(id)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select('id,status')
      .single()

    if (error) {
      console.error('Erro ao atualizar lead:', error)
      return NextResponse.json({ error: SERVER_ERROR }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Erro inesperado ao atualizar lead:', error)
    return NextResponse.json({ error: SERVER_ERROR }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await getSupabaseAdmin().auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await getSupabaseAdmin()
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 })
    }

    const { data: leads, error } = await getSupabaseAdmin()
      .from('leads')
      .select('id,nome,telefone,email,area,tipo,resumo,arquivos,aceite_lgpd,status,created_at,origem')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar leads:', error)
      return NextResponse.json({ error: SERVER_ERROR }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: leads || [] })

  } catch (error) {
    console.error('Erro inesperado ao buscar leads:', error)
    return NextResponse.json({ error: SERVER_ERROR }, { status: 500 })
  }
}
