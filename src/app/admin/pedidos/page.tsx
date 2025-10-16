'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  session_id: string
  email: string | null
  status: string
  amount: number
  payment_method: string
  calc_data: any
  created_at: string
  paid_at: string | null
}

export default function PedidosPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [busyId, setBusyId] = useState<string>('')
  const [stats, setStats] = useState<{ total: number; paid: number; pending: number; revenue: number }>({ total: 0, paid: 0, pending: 0, revenue: 0 })

  useEffect(() => {
    checkAuth()
    loadOrders()
  }, [filter])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }

    // Verificar se é admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      router.push('/')
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      const list = (data || []) as Order[]
      setOrders(list)
      // Compute stats client-side
      const total = list.length
      const paid = list.filter(o => o.status === 'paid').length
      const pending = list.filter(o => o.status === 'pending').length
      const revenue = list.filter(o => o.status === 'paid').reduce((sum, o) => sum + (o.amount || 0), 0)
      setStats({ total, paid, pending, revenue })
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const generateAndStorePDF = async (order: Order) => {
    try {
      setBusyId(order.id)
      const res = await fetch('/api/admin/orders/generate-pdf', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: order.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(String(data?.error || data))
      alert('PDF gerado e armazenado com sucesso!')
    } catch (e: any) {
      alert('Falha ao gerar PDF: ' + (e?.message || e))
    } finally {
      setBusyId('')
    }
  }

  const copySignedUrl = async (order: Order) => {
    try {
      setBusyId(order.id)
      const url = new URL('/api/admin/orders/signed-url', window.location.origin)
      url.searchParams.set('id', order.id)
      const res = await fetch(url.toString())
      const data = await res.json()
      if (!res.ok || !data?.url) throw new Error(String(data?.error || data))
      await navigator.clipboard.writeText(data.url)
      alert('Link copiado para a área de transferência!')
    } catch (e: any) {
      alert('Falha ao gerar link: ' + (e?.message || e))
    } finally {
      setBusyId('')
    }
  }

  const sendEmail = async (order: Order) => {
    try {
      setBusyId(order.id)
      let to = order.email || ''
      if (!to) {
        const entered = window.prompt('Informe o e-mail do cliente:')
        if (!entered) return
        to = entered
      }
      const res = await fetch('/api/admin/orders/send-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: order.id, to })
      })
      if (!res.ok) throw new Error(await res.text())
      alert('E-mail enviado com sucesso!')
    } catch (e: any) {
      alert('Falha ao enviar e-mail: ' + (e?.message || e))
    } finally {
      setBusyId('')
    }
  }

  const gerarPDF = (order: Order) => {
    const calc = order.calc_data
    if (!calc) return

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

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
            padding-bottom: 8px;
            margin-bottom: 15px;
          }
          .logo {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 3px;
          }
          .contact {
            font-size: 10px;
            color: #666;
          }
          .section {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
          }
          .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 8px;
            color: #1e40af;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
          }
          .data-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px dotted #ddd;
          }
          .data-row:last-child {
            border-bottom: none;
          }
          .total {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            padding: 12px;
            background: #1e40af;
            color: white;
            border-radius: 4px;
            margin: 15px 0;
          }
          .disclaimer {
            font-size: 9px;
            color: #666;
            border: 1px solid #ddd;
            padding: 8px;
            margin-top: 15px;
            background: #f9f9f9;
          }
          @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">NEVES & COSTA ADVOCACIA</div>
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

        <div style="margin-top: 15px; text-align: center; font-size: 10px; color: #999;">
          Documento gerado em ${formatDate(order.paid_at || order.created_at)}
        </div>

        <script>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedidos de PDF</h1>
          <p className="text-gray-600">Gerencie os pedidos de download de PDF de cálculos de rescisão</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Pedidos</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Pagos</div>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Pendentes</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Receita</div>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.revenue / 100)}</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'paid'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pagos
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={loadOrders}
              className="ml-auto px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
            >
              🔄 Atualizar
            </button>
            <a
              href="/api/admin/orders/export"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
            >
              ⬇️ Exportar CSV
            </a>
          </div>
        </div>

        {/* Lista de pedidos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.calc_data?.nomeFuncionario || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.payment_method === 'card' ? '💳 Cartão' : '💱 Pix'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'paid' ? 'Pago' : order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        👁️ Ver
                      </button>
                      <button
                        onClick={() => gerarPDF(order)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        📄 PDF
                      </button>
                      <button
                        disabled={busyId === order.id}
                        onClick={() => generateAndStorePDF(order)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50"
                      >
                        💾 Salvar PDF
                      </button>
                      <button
                        disabled={busyId === order.id}
                        onClick={() => copySignedUrl(order)}
                        className="text-amber-600 hover:text-amber-900 mr-3 disabled:opacity-50"
                      >
                        🔗 Copiar Link
                      </button>
                      <button
                        disabled={busyId === order.id}
                        onClick={() => sendEmail(order)}
                        className="text-rose-600 hover:text-rose-900 disabled:opacity-50"
                      >
                        ✉️ Enviar E-mail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Detalhes do Pedido</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Session ID</label>
                <p className="text-sm text-gray-900 font-mono">{selectedOrder.session_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Criação</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedOrder.created_at)}</p>
                </div>
                {selectedOrder.paid_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Pagamento</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedOrder.paid_at)}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Dados do Cálculo</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <p><strong>Nome:</strong> {selectedOrder.calc_data?.nomeFuncionario}</p>
                  <p><strong>Empresa:</strong> {selectedOrder.calc_data?.nomeEmpresa}</p>
                  <p><strong>Salário:</strong> {formatCurrency(selectedOrder.calc_data?.salario * 100)}</p>
                  <p><strong>Total:</strong> {formatCurrency(selectedOrder.calc_data?.total * 100)}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    gerarPDF(selectedOrder)
                    setShowModal(false)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  📄 Gerar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
