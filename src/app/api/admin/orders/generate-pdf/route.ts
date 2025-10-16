import { NextRequest } from 'next/server'
import PDFDocument from 'pdfkit'
import { createClient } from '@supabase/supabase-js'

function generatePdfBuffer(calc: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 36 })
    const chunks: any[] = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks as Buffer[])))
    doc.on('error', reject)

    // Header
    doc.fontSize(18).fillColor('#1e40af').text('NEVES & COSTA ADVOCACIA', { align: 'center' })
    doc.moveDown(0.2)
    doc.fontSize(10).fillColor('#000').text('Email: contato@nevesecosta.com.br | Telefone: (73) 99934-8552', { align: 'center' })
    doc.moveDown()

    doc.fontSize(14).fillColor('#1e40af').text('Cálculo de Rescisão', { align: 'left' })
    doc.moveTo(36, doc.y + 2).lineTo(559, doc.y + 2).stroke('#ddd')
    doc.moveDown()

    const money = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

    // Dados do funcionário
    doc.fontSize(12).fillColor('#111').text('Dados do Funcionário', { underline: true })
    doc.moveDown(0.5)
    const row = (k: string, v: string) => { doc.fontSize(10).text(`${k}: ${v}`) }
    row('Nome', String(calc?.nomeFuncionario || ''))
    row('Empresa', String(calc?.nomeEmpresa || ''))
    row('Admissão', String(calc?.dataAdmissao || ''))
    row('Demissão', String(calc?.dataDemissao || ''))
    row('Tempo Trabalhado', String(calc?.tempoTrabalhado || ''))
    row('Salário', money(Number(calc?.salario || 0)))
    doc.moveDown()

    // Cálculo
    doc.fontSize(12).fillColor('#111').text('Cálculo da Rescisão', { underline: true })
    doc.moveDown(0.5)
    const kv = (k: string, v: number | string) => doc.fontSize(10).text(`${k}: ${typeof v === 'number' ? money(v) : v}`)
    kv(`Saldo de Salário (${calc?.diasUltimoMes || 0} dias)`, Number(calc?.saldoSalario || 0))
    kv('Aviso Prévio', Number(calc?.avisoPrevio || 0))
    kv('13º Proporcional', Number(calc?.decimoTerceiro || 0))
    kv('Férias + 1/3', Number(calc?.ferias || 0))
    kv('Multa FGTS (40%)', Number(calc?.multaFgts || 0))
    if (Number(calc?.salarioFamilia || 0) > 0) kv('Salário Família', Number(calc?.salarioFamilia || 0))
    kv('Desconto INSS', `- ${money(Number(calc?.descontoINSS || 0))}`)
    doc.moveDown()

    doc.fontSize(14).fillColor('#fff').rect(36, doc.y, 523, 24).fill('#1e40af')
    doc.fill('#fff').text(`TOTAL LÍQUIDO: ${money(Number(calc?.total || 0))}`, 42, doc.y - 18)

    doc.end()
  })
}

export async function POST(req: NextRequest) {
  try {
    const { id, session_id } = await req.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) return new Response('supabase not configured', { status: 500 })

    const supabase = createClient(supabaseUrl, serviceKey)

    // Buscar pedido
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, session_id, calc_data, pdf_path, pdf_expires_at')
      .eq(id ? 'id' : 'session_id', id || session_id)
      .single()
    if (error || !order) return new Response('order not found', { status: 404 })

    // Se já existir PDF válido, não recria
    const now = new Date()
    if (order.pdf_path && order.pdf_expires_at && new Date(order.pdf_expires_at) > now) {
      return new Response(JSON.stringify({ ok: true, reused: true, path: order.pdf_path }), { status: 200, headers: { 'content-type': 'application/json' } })
    }

    // Garantir bucket
    const bucket = 'pdfs'
    try {
      // Will throw if exists; ignore
      // @ts-ignore
      await supabase.storage.createBucket(bucket, { public: false })
    } catch {}

    // Gerar PDF
    const buf = await generatePdfBuffer(order.calc_data)
    const path = `orders/${order.id}.pdf`

    // Upload
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, buf, {
      contentType: 'application/pdf',
      upsert: true,
    })
    if (upErr) return new Response(String(upErr.message || upErr), { status: 500 })

    // Atualizar metadados
    const expiresAt = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
    await supabase.from('orders').update({ pdf_path: `${bucket}/${path}`, pdf_expires_at: expiresAt }).eq('id', order.id)

    return new Response(JSON.stringify({ ok: true, path: `${bucket}/${path}`, expires_at: expiresAt }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 })
  }
}
