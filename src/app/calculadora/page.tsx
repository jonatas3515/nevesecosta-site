'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, DollarSign, Calendar, FileText, Download } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function CalculadoraRescisoria() {
  const [formData, setFormData] = useState({
    nomeFuncionario: '',
    nomeEmpresa: '',
    salario: '',
    dataAdmissao: '',
    dataDemissao: '',
    filhosMenores14: '0',
    motivoSaida: 'demissaoSemJustaCausa',
    trabalhouAvisoPrevio: false,
    feriasVencidas: false
  })

  const [resultado, setResultado] = useState<any>(null)
  const [showPayModal, setShowPayModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card')
  const [canDownload, setCanDownload] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [productPrice, setProductPrice] = useState(7500)
  const [productPromoPrice, setProductPromoPrice] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          
          if (mounted && profile && ['admin', 'editor'].includes(profile.role)) {
            setIsAdmin(true)
            setCanDownload(true)
          }
        }
      } catch (err) {
        console.error('[calculadora] Error checking admin:', err)
      }
    }

    const checkPayment = async () => {
      const params = new URLSearchParams(window.location.search)
      const paid = params.get('paid')
      const sessionId = params.get('session_id')
      console.log('[calculadora] URL params:', { paid, sessionId })
      
      if (paid && sessionId) {
        try {
          setVerifying(true)
          console.log('[calculadora] Verifying payment...')
          const res = await fetch(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
          console.log('[calculadora] Verify response:', res.status, res.ok)
          const data = await res.json()
          console.log('[calculadora] Verify data:', data)
          
          if (!mounted) return
          
          if (data.paid && data.calc) {
            setResultado(data.calc)
            setCanDownload(true)
            setTimeout(() => {
              gerarPDFComDados(data.calc)
            }, 500)
          } else {
            alert('Pagamento não confirmado. Tente novamente ou entre em contato.')
          }
        } catch (err) {
          console.error('[calculadora] Error:', err)
          if (mounted) {
            alert('Erro ao verificar pagamento. Tente novamente.')
          }
        } finally {
          if (mounted) {
            setVerifying(false)
          }
        }
      }
    }

    const loadProductPrice = async () => {
      try {
        const { data } = await supabase.from('products').select('price_cents, promo_price_cents').eq('name', 'Cálculo em PDF').eq('active', true).maybeSingle()
        if (mounted && data) {
          setProductPrice(data.price_cents || 7500)
          setProductPromoPrice(data.promo_price_cents)
        }
      } catch {}
    }

    checkAdmin()
    checkPayment()
    loadProductPrice()
    
    return () => {
      mounted = false
    }
  }, [])

  const calcularRescisao = () => {
    const salario = parseFloat(formData.salario) || 0
    const filhos = parseInt(formData.filhosMenores14) || 0
    
    // Calcular tempo trabalhado
    const dataAdm = new Date(formData.dataAdmissao)
    const dataDem = new Date(formData.dataDemissao)
    const diffTime = Math.abs(dataDem.getTime() - dataAdm.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const meses = Math.floor(diffDays / 30)
    const anos = Math.floor(meses / 12)
    const mesesRestantes = meses % 12
    
    // Calcular dias do último mês (do dia 1 até o último dia trabalhado)
    // Ex: demissão 14/10/2025 = 14 dias (do dia 1 ao dia 14)
    // Usar UTC para evitar problemas de timezone
    const diasUltimoMes = new Date(formData.dataDemissao + 'T12:00:00').getDate()
    
    // Saldo de salário baseado nos dias trabalhados do último mês
    const saldoSalario = (salario / 30) * diasUltimoMes

    let calculo = {
      nomeFuncionario: formData.nomeFuncionario,
      nomeEmpresa: formData.nomeEmpresa,
      dataAdmissao: formData.dataAdmissao,
      dataDemissao: formData.dataDemissao,
      tempoTrabalhado: `${anos} anos e ${mesesRestantes} meses`,
      diasUltimoMes: diasUltimoMes,
      salario: salario,
      saldoSalario: saldoSalario,
      avisoPrevio: 0,
      decimoTerceiro: 0,
      ferias: 0,
      fgts: 0,
      multaFgts: 0,
      salarioFamilia: 0,
      descontoINSS: 0,
      total: 0
    }

    // Aviso Prévio: 30 dias + 3 dias por ano completo
    if (!formData.trabalhouAvisoPrevio && formData.motivoSaida === 'demissaoSemJustaCausa') {
      const diasAvisoPrevio = 30 + (anos * 3)
      calculo.avisoPrevio = (salario / 30) * diasAvisoPrevio
    }

    // 13º Salário Proporcional
    if (formData.motivoSaida !== 'demissaoComJustaCausa') {
      calculo.decimoTerceiro = (salario / 12) * mesesRestantes
    }

    // Férias Proporcionais + 1/3
    if (formData.motivoSaida !== 'demissaoComJustaCausa') {
      const feriasProporcionais = (salario / 12) * mesesRestantes
      const umTercoFerias = feriasProporcionais / 3
      calculo.ferias = feriasProporcionais + umTercoFerias
    }

    // Férias Vencidas + 1/3
    if (formData.feriasVencidas) {
      const feriasVencidas = salario
      const umTercoVencidas = salario / 3
      calculo.ferias += feriasVencidas + umTercoVencidas
    }

    // Salário Família (do dia 1 até o último dia trabalhado do mês)
    if (filhos > 0) {
      const valorSalarioFamilia = 65.00 // Valor 2025
      calculo.salarioFamilia = (valorSalarioFamilia / 30) * diasUltimoMes * filhos
    }

    // Calcular INSS sobre saldo de salário + décimo terceiro + salário família
    const calcularINSS = (baseCalculo: number) => {
      // Tabela INSS 2025
      if (baseCalculo <= 1518.00) {
        return baseCalculo * 0.075
      } else if (baseCalculo <= 2793.88) {
        return (1518.00 * 0.075) + ((baseCalculo - 1518.00) * 0.09)
      } else if (baseCalculo <= 4190.83) {
        return (1518.00 * 0.075) + ((2793.88 - 1518.00) * 0.09) + ((baseCalculo - 2793.88) * 0.12)
      } else if (baseCalculo <= 8157.41) {
        return (1518.00 * 0.075) + ((2793.88 - 1518.00) * 0.09) + ((4190.83 - 2793.88) * 0.12) + ((baseCalculo - 4190.83) * 0.14)
      } else {
        return (1518.00 * 0.075) + ((2793.88 - 1518.00) * 0.09) + ((4190.83 - 2793.88) * 0.12) + ((8157.41 - 4190.83) * 0.14)
      }
    }

    // Base de cálculo do INSS: saldo de salário + décimo terceiro + salário família
    const baseCalculoINSS = calculo.saldoSalario + calculo.decimoTerceiro + calculo.salarioFamilia
    const descontoINSS = calcularINSS(baseCalculoINSS)
    calculo.descontoINSS = descontoINSS

    // FGTS (8% sobre remunerações + aviso prévio quando aplicável)
    let totalRemuneracoesFGTS = salario * meses
    
    // Adicionar aviso prévio ao cálculo do FGTS se aplicável
    if (!formData.trabalhouAvisoPrevio && formData.motivoSaida === 'demissaoSemJustaCausa') {
      totalRemuneracoesFGTS += calculo.avisoPrevio
      
      // Verificar se os dias de aviso prévio completam um mês adicional
      const diasAvisoPrevio = 30 + (anos * 3)
      const diasTotaisUltimoMes = diasUltimoMes + diasAvisoPrevio
      if (diasTotaisUltimoMes >= 30) {
        const mesesAdicionais = Math.floor(diasTotaisUltimoMes / 30)
        totalRemuneracoesFGTS += (salario * (mesesAdicionais - 1)) // -1 porque já contamos o mês atual
      }
    }
    
    calculo.fgts = totalRemuneracoesFGTS * 0.08

    // Multa FGTS (não mostrar FGTS, só multa)
    if (formData.motivoSaida === 'demissaoSemJustaCausa') {
      calculo.multaFgts = calculo.fgts * 0.4
    } else if (formData.motivoSaida === 'acordoMutuo') {
      calculo.multaFgts = calculo.fgts * 0.2
    }

    // Total (sem mostrar FGTS, apenas multa, e descontando INSS)
    const totalBruto = calculo.saldoSalario + calculo.avisoPrevio + calculo.decimoTerceiro + 
                      calculo.ferias + calculo.multaFgts + calculo.salarioFamilia
    
    calculo.total = totalBruto - calculo.descontoINSS

    setResultado(calculo)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const gerarPDFComDados = (calc: any) => {
    if (!calc) return
    
    const conteudoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Cálculo de Rescisão - ${calc.nomeFuncionario}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 15px;
            line-height: 1.4;
            font-size: 13px;
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #333;
            padding-bottom: 12px;
            margin-bottom: 18px;
          }
          .logo {
            width: 70px;
            height: auto;
            margin-bottom: 6px;
          }
          .title {
            font-size: 18px;
            font-weight: bold;
            margin: 6px 0;
          }
          .contact {
            font-size: 11px;
            color: #666;
          }
          .section {
            margin: 12px 0;
          }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
            margin-bottom: 10px;
          }
          .data-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            border-bottom: 1px dotted #ddd;
            font-size: 12px;
          }
          .total {
            font-size: 16px;
            font-weight: bold;
            background: #fbbf24;
            padding: 10px;
            text-align: center;
            margin: 12px 0;
          }
          .disclaimer {
            background: #f5f5f5;
            padding: 10px;
            font-size: 10px;
            border-left: 3px solid #fbbf24;
            margin: 12px 0;
          }
          .footer {
            text-align: center;
            margin-top: 18px;
            font-style: italic;
            font-size: 11px;
          }
          @media print {
            body { margin: 0; font-size: 12px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/Logo transparente.png" alt="Neves & Costa" class="logo">
          <div class="title">CÁLCULO DE RESCISÃO TRABALHISTA</div>
          <div class="contact">
            <strong>NEVES & COSTA ADVOCACIA</strong><br>
            Email: contato@nevesecosta.com.br | Telefone: (73) 99934-8552
          </div>
        </div>

        <div class="section">
          <div class="section-title">DADOS DO FUNCIONÁRIO</div>
          <div class="data-row">
            <span>Nome:</span>
            <span>${calc.nomeFuncionario}</span>
          </div>
          <div class="data-row">
            <span>Empresa:</span>
            <span>${calc.nomeEmpresa}</span>
          </div>
          <div class="data-row">
            <span>Data de Admissão:</span>
            <span>${calc.dataAdmissao}</span>
          </div>
          <div class="data-row">
            <span>Data de Demissão:</span>
            <span>${calc.dataDemissao}</span>
          </div>
          <div class="data-row">
            <span>Tempo Trabalhado:</span>
            <span>${calc.tempoTrabalhado}</span>
          </div>
          <div class="data-row">
            <span>Salário:</span>
            <span>${formatCurrency(calc.salario)}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">CÁLCULO DA RESCISÃO</div>
          <div class="data-row">
            <span>Saldo de Salário (${calc.diasUltimoMes} dias):</span>
            <span>${formatCurrency(calc.saldoSalario)}</span>
          </div>
          <div class="data-row">
            <span>Aviso Prévio:</span>
            <span>${formatCurrency(calc.avisoPrevio)}</span>
          </div>
          <div class="data-row">
            <span>13º Proporcional:</span>
            <span>${formatCurrency(calc.decimoTerceiro)}</span>
          </div>
          <div class="data-row">
            <span>Férias + 1/3:</span>
            <span>${formatCurrency(calc.ferias)}</span>
          </div>
          <div class="data-row">
            <span>Multa FGTS (40%):</span>
            <span>${formatCurrency(calc.multaFgts)}</span>
          </div>
          ${calc.salarioFamilia > 0 ? `
          <div class="data-row">
            <span>Salário Família:</span>
            <span>${formatCurrency(calc.salarioFamilia)}</span>
          </div>` : ''}
          <div class="data-row" style="color: #dc2626; border-color: #dc2626;">
            <span>Desconto INSS:</span>
            <span>- ${formatCurrency(calc.descontoINSS)}</span>
          </div>
        </div>

        <div class="total">
          TOTAL LÍQUIDO: ${formatCurrency(calc.total)}
        </div>

        <div class="disclaimer">
          <strong>AVISO LEGAL:</strong><br>
          Este cálculo é apenas uma estimativa baseada nos dados informados.
          Os valores podem variar dependendo de convenções coletivas, acordos
          individuais e outras particularidades. Para um cálculo preciso e
          orientação jurídica adequada, consulte um advogado especializado.
        </div>

        <div class="footer">
          <strong>NEVES & COSTA ADVOCACIA</strong><br>
          "Do seu direito, a gente cuida"<br>
          Advocacia 100% Digital desde 2021
        </div>

        <script>
          // Auto-print quando a página carregar
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `
    
    const novaJanela = window.open('', '_blank')
    if (novaJanela) {
      novaJanela.document.write(conteudoHTML)
      novaJanela.document.close()
    }
  }

  const gerarPDF = () => {
    if (!resultado) return
    if (!canDownload && !isAdmin) {
      setShowPayModal(true)
      return
    }
    gerarPDFComDados(resultado)
  }

  const iniciarPagamento = async () => {
    if (!resultado) return
    if (paymentMethod === 'pix') {
      alert('Pix temporariamente indisponível. Por favor, escolha pagamento por cartão.')
      return
    }
    const endpoint = '/api/payments/stripe/create-session'
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ calc: resultado }),
      })
      const text = await resp.text()
      let data: any = {}
      try { data = JSON.parse(text) } catch {}
      if (!resp.ok) {
        const msg = data?.error || text || 'Falha ao iniciar checkout.'
        alert('Erro ao iniciar pagamento: ' + msg)
        return
      }
      if (data?.url) {
        window.location.href = data.url
      } else {
        alert('Resposta inválida do servidor ao criar sessão de pagamento.')
      }
    } catch (e: any) {
      alert('Erro de rede ao iniciar pagamento: ' + (e?.message || e))
    }
  }

  const consultarWhatsApp = () => {
    const mensagem = resultado ? 
      `Olá! Fiz um cálculo de rescisão no site de vocês para ${resultado.nomeFuncionario} e gostaria de uma consulta jurídica. O valor calculado foi ${formatCurrency(resultado.total)}.` :
      'Olá! Gostaria de uma consulta jurídica sobre rescisão trabalhista.'
    
    const url = `https://wa.me/5573999348552?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32">
      {/* Header */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <Link 
            href="/"
            className="inline-flex items-center text-[#fbbf24] hover:text-[#d97706] transition-colors mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Voltar ao Site
          </Link>
          <div className="flex items-center space-x-3">
            <Calculator className="text-[#fbbf24]" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">
              Calculadora de Rescisão Trabalhista
            </h1>
          </div>
          <p className="text-gray-300 mt-2">
            Calcule os valores aproximados da sua rescisão trabalhista
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#fbbf24] mb-6">
                Dados para Cálculo
              </h2>

              <div className="space-y-6">
                {/* Nome do Funcionário */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      👤 Nome do Funcionário
                    </label>
                    <input
                      type="text"
                      value={formData.nomeFuncionario}
                      onChange={(e) => setFormData({...formData, nomeFuncionario: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      🏢 Nome da Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.nomeEmpresa}
                      onChange={(e) => setFormData({...formData, nomeEmpresa: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent"
                      placeholder="Ex: Empresa ABC Ltda"
                    />
                  </div>
                </div>

                {/* Salário e Filhos */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      💰 Salário Mensal Bruto (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.salario}
                      onChange={(e) => setFormData({...formData, salario: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent"
                      placeholder="Ex: 2500.00"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      👶 Filhos menores de 14 anos
                    </label>
                    <input
                      type="number"
                      value={formData.filhosMenores14}
                      onChange={(e) => setFormData({...formData, filhosMenores14: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Datas */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      📅 Data de Admissão
                    </label>
                    <input
                      type="date"
                      value={formData.dataAdmissao}
                      onChange={(e) => setFormData({...formData, dataAdmissao: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      📅 Data de Demissão
                    </label>
                    <input
                      type="date"
                      value={formData.dataDemissao}
                      onChange={(e) => setFormData({...formData, dataDemissao: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Motivo da Saída */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    📋 Motivo da Saída
                  </label>
                  <select
                    value={formData.motivoSaida}
                    onChange={(e) => setFormData({...formData, motivoSaida: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent"
                  >
                    <option value="demissaoSemJustaCausa">Demissão sem Justa Causa</option>
                    <option value="demissaoComJustaCausa">Demissão com Justa Causa</option>
                    <option value="pedidoDemissao">Pedido de Demissão</option>
                    <option value="acordoMutuo">Acordo Mútuo</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="trabalhouAvisoPrevio"
                      checked={formData.trabalhouAvisoPrevio}
                      onChange={(e) => setFormData({...formData, trabalhouAvisoPrevio: e.target.checked})}
                      className="w-5 h-5 text-[#fbbf24] bg-gray-800 border-gray-700 rounded focus:ring-[#fbbf24]"
                    />
                    <label htmlFor="trabalhouAvisoPrevio" className="text-white">
                      ⚠️ Trabalhou aviso prévio
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="feriasVencidas"
                      checked={formData.feriasVencidas}
                      onChange={(e) => setFormData({...formData, feriasVencidas: e.target.checked})}
                      className="w-5 h-5 text-[#fbbf24] bg-gray-800 border-gray-700 rounded focus:ring-[#fbbf24]"
                    />
                    <label htmlFor="feriasVencidas" className="text-white">
                      🏖️ Férias vencidas
                    </label>
                  </div>
                </div>


                {/* Botão Calcular */}
                <button
                  onClick={calcularRescisao}
                  className="w-full bg-[#fbbf24] text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-[#d97706] transition-colors flex items-center justify-center space-x-2"
                >
                  <Calculator size={20} />
                  <span>Calcular Rescisão</span>
                </button>
              </div>
            </div>

            {/* Resultado */}
            <div className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#fbbf24] mb-6">
                Resultado do Cálculo
              </h2>

              {resultado ? (
                <div className="space-y-4">
                  {/* Dados do Funcionário */}
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="text-[#fbbf24] font-bold mb-3">Dados do Funcionário</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Nome:</span>
                        <span className="text-white">{resultado.nomeFuncionario}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Empresa:</span>
                        <span className="text-white">{resultado.nomeEmpresa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Tempo Trabalhado:</span>
                        <span className="text-white">{resultado.tempoTrabalhado}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Salário:</span>
                        <span className="text-white">{formatCurrency(resultado.salario)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cálculos */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Saldo de Salário:</span>
                      <span className="text-white font-semibold">{formatCurrency(resultado.saldoSalario)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Aviso Prévio:</span>
                      <span className="text-white font-semibold">{formatCurrency(resultado.avisoPrevio)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">13º Proporcional:</span>
                      <span className="text-white font-semibold">{formatCurrency(resultado.decimoTerceiro)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Férias + 1/3:</span>
                      <span className="text-white font-semibold">{formatCurrency(resultado.ferias)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Multa FGTS (40%):</span>
                      <span className="text-white font-semibold">{formatCurrency(resultado.multaFgts)}</span>
                    </div>
                  </div>


                  {resultado.salarioFamilia > 0 && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Salário Família:</span>
                        <span className="text-white font-semibold">{formatCurrency(resultado.salarioFamilia)}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-red-300">Desconto INSS:</span>
                      <span className="text-red-300 font-semibold">- {formatCurrency(resultado.descontoINSS)}</span>
                    </div>
                  </div>

                  <div className="bg-[#fbbf24] rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold text-lg">TOTAL:</span>
                      <span className="text-gray-900 font-bold text-xl">{formatCurrency(resultado.total)}</span>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={gerarPDF}
                      className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="mr-2" size={20} />
                      {canDownload ? 'Imprimir PDF' : 'Baixar PDF'}
                    </button>
                    <button
                      onClick={consultarWhatsApp}
                      className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <DollarSign className="mr-2" size={20} />
                      Consultar no WhatsApp
                    </button>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-6">
                    <p className="text-red-300 text-sm">
                      <strong>Importante:</strong> Este cálculo é apenas uma estimativa baseada nos dados informados. 
                      Para um cálculo preciso e orientação jurídica adequada, consulte um advogado especializado.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <Calculator className="mx-auto mb-4" size={48} />
                  <p>Preencha os dados ao lado e clique em "Calcular Rescisão" para ver o resultado.</p>
                </div>
              )}
            </div>
          </div>

          {/* Aviso Legal */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mt-8">
            <h3 className="text-yellow-400 font-bold mb-2">Aviso Legal</h3>
            <p className="text-yellow-200 text-sm">
              Esta calculadora fornece apenas uma estimativa dos valores de rescisão trabalhista com base nos dados informados. 
              Os cálculos podem variar dependendo de fatores específicos como convenções coletivas, acordos individuais, 
              benefícios adicionais e outras particularidades. Para um cálculo preciso e orientação jurídica adequada, 
              recomendamos consultar um advogado especializado em Direito Trabalhista.
            </p>
          </div>

          {/* CTAs de Links Internos */}
          <div className="mt-8 bg-gray-900 rounded-2xl p-8 border border-gold-500/20">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Aprofunde-se e saiba mais</h3>
            <p className="text-gray-300 text-center mb-6">Conheça nossas áreas de atuação ou leia nossos artigos no Blog.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/areas" className="px-6 py-3 rounded-lg bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600">Áreas de Atuação</a>
              <a href="/blog" className="px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700">Blog</a>
              <a href="/#contato" className="px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-200">Fale Conosco</a>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de Pagamento */}
      <PayModal
        open={showPayModal}
        onClose={() => setShowPayModal(false)}
        onConfirm={iniciarPagamento}
        verifying={verifying}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        productPrice={productPrice}
        productPromoPrice={productPromoPrice}
      />
    </div>
  )
}

// Modal de Pagamento
// Inserido no final para manter o arquivo com um único export default acima
function PayModal({ open, onClose, onConfirm, verifying, paymentMethod, setPaymentMethod, productPrice, productPromoPrice }: {
  open: boolean,
  onClose: () => void,
  onConfirm: () => void,
  verifying?: boolean,
  paymentMethod: 'card' | 'pix',
  setPaymentMethod: (method: 'card' | 'pix') => void,
  productPrice: number,
  productPromoPrice: number | null,
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-full max-w-md rounded-xl p-6 text-gray-900">
        <h3 className="text-xl font-bold mb-2">Baixar PDF do Cálculo</h3>
        <p className="text-sm text-gray-600 mb-4">
          Para baixar o PDF do seu cálculo de rescisão, é necessário um pagamento simbólico de{' '}
          {productPromoPrice && productPromoPrice > 0 ? (
            <><strong className="line-through text-gray-400">R$ {(productPrice / 100).toFixed(2).replace('.', ',')}</strong> <strong className="text-green-600">R$ {(productPromoPrice / 100).toFixed(2).replace('.', ',')}</strong></>
          ) : (
            <strong>R$ {(productPrice / 100).toFixed(2).replace('.', ',')}</strong>
          )}.
          Este valor ajuda a manter o site no ar e oferecer ferramentas gratuitas para todos.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Você poderá pagar com <strong>cartão de crédito</strong> ou <strong>Pix</strong> de forma segura via Stripe.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Escolha a forma de pagamento:</label>
          <div className="flex gap-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 px-4 py-3 rounded-md border-2 transition-colors ${
                paymentMethod === 'card'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              💳 Cartão
            </button>
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`flex-1 px-4 py-3 rounded-md border-2 transition-colors ${
                paymentMethod === 'pix'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              💱 Pix
            </button>
          </div>
        </div>
        {paymentMethod === 'pix' && (
          <div className="mb-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-3">
            Pix temporariamente indisponível. Por favor, utilize pagamento por cartão.
          </div>
        )}
        <div className="flex gap-3 mt-5 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">Cancelar</button>
          <button onClick={onConfirm} disabled={paymentMethod === 'pix'} className={`px-4 py-2 rounded-md text-white ${paymentMethod === 'pix' ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600'}`}>Fazer Pagamento</button>
        </div>
        {verifying && <div className="text-sm text-gray-500 mt-2">Verificando pagamento...</div>}
      </div>
    </div>
  )
}
