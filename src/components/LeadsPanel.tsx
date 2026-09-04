/**
 * ATENÇÃO: COMPONENTE SENSÍVEL - PAINEL DE LEADS
 * 
 * Este componente gerencia a exibição e exportação de leads.
 * A interface Lead local usa somente colunas existentes na tabela.
 * e difere da interface em admin/contatos/page.tsx.
 * 
 * NÃO unificar tipos sem validar que ambos os contextos
 * usam exatamente os mesmos campos da mesma forma.
 */
'use client'

import { useEffect, useState } from 'react'
import { Users, Phone, Mail, Calendar, Filter, Search, Download } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import AdminButton from '@/components/AdminButton'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface Lead {
  id: string
  nome: string
  telefone: string
  email?: string
  area: string
  tipo: string
  resumo?: string
  arquivos: any[]
  aceite_lgpd: boolean
  status: string
  created_at: string
}

export default function LeadsPanel() {
  const { isAdmin } = useAdminAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  useEffect(() => {
    if (!isAdmin) return
    fetchLeads()
  }, [isAdmin])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      
      // Obter token do usuário atual
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/leads', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar leads')
      }

      const result = await response.json()
      setLeads(result.data || [])
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      })

      if (response.ok) {
        fetchLeads() // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.telefone.includes(searchTerm) ||
                         lead.area.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportToCSV = () => {
    const headers = ['Nome', 'Telefone', 'Email', 'Área', 'Tipo', 'Status', 'Data']
    const rows = filteredLeads.map(lead => [
      lead.nome,
      lead.telefone,
      lead.email || '',
      lead.area,
      lead.tipo,
      lead.status,
      new Date(lead.created_at).toLocaleDateString('pt-BR')
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Apenas administradores podem acessar esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Users className="mr-3" size={32} />
                  Painel de Leads
                </h1>
                <p className="text-gray-600 mt-2">
                  Gerencie os leads capturados pelo Assistente N&C
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{leads.length}</div>
                  <div className="text-sm text-gray-600">Total de Leads</div>
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={20} className="mr-2" />
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone ou área..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="todos">Todos os status</option>
                  <option value="novo">Novo</option>
                  <option value="contatado">Contatado</option>
                  <option value="em análise">Em análise</option>
                  <option value="concluído">Concluído</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="text-gray-600">Carregando leads...</div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center">
                <Users size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum lead encontrado
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'todos' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Nenhum lead capturado ainda.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Área
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.tipo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Phone size={14} className="mr-1" />
                            {lead.telefone}
                          </div>
                          {lead.email && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail size={14} className="mr-1" />
                              {lead.email}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="text-sm px-2 py-1 rounded-full border"
                            style={{
                              backgroundColor: 
                                lead.status === 'novo' ? '#fef3c7' :
                                lead.status === 'contatado' ? '#dbeafe' :
                                lead.status === 'em análise' ? '#e9d5ff' :
                                '#d1fae5'
                            }}
                          >
                            <option value="novo">Novo</option>
                            <option value="contatado">Contatado</option>
                            <option value="em análise">Em análise</option>
                            <option value="concluído">Concluído</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => window.open(`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`, '_blank')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
