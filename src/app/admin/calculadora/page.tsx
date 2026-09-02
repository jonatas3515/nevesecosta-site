'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Save, Calculator } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function AdminCalculadoraSettings() {
  const { show } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState<any>({
    salario_minimo: 1621.00,
    salario_familia: 67.54,
    teto_inss: 8475.55,
    inss_faixa1_limite: 1621.00,
    inss_faixa1_aliquota: 0.075,
    inss_faixa2_limite: 2902.84,
    inss_faixa2_aliquota: 0.09,
    inss_faixa3_limite: 4354.27,
    inss_faixa3_aliquota: 0.12,
    inss_faixa4_limite: 8475.55,
    inss_faixa4_aliquota: 0.14,
    irrf_deducao_dependente: 189.59,
    irrf_desconto_simplificado: 564.80,
    irrf_faixa1_limite: 2259.20,
    irrf_faixa2_limite: 2826.65,
    irrf_faixa2_aliquota: 0.075,
    irrf_faixa2_deducao: 169.44,
    irrf_faixa3_limite: 3751.05,
    irrf_faixa3_aliquota: 0.15,
    irrf_faixa3_deducao: 381.44,
    irrf_faixa4_limite: 4664.68,
    irrf_faixa4_aliquota: 0.225,
    irrf_faixa4_deducao: 662.77,
    irrf_faixa5_aliquota: 0.275,
    irrf_faixa5_deducao: 896.00,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('calculator_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (data) {
        setSettings(data)
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error)
        show({ title: 'Erro ao carregar as configurações', variant: 'error' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    // Permitir string vazia ou números
    setSettings({ ...settings, [key]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Converter de volta para número antes de salvar
      const dataToSave = { ...settings, id: 1 }
      for (const key in dataToSave) {
        if (key !== 'id' && key !== 'updated_at') {
          dataToSave[key] = parseFloat(dataToSave[key]) || 0
        }
      }

      const { error } = await supabase
        .from('calculator_settings')
        .upsert(dataToSave)

      if (error) throw error
      show({ title: 'Configurações da calculadora salvas com sucesso!', variant: 'success' })
      fetchSettings() // Recarregar com formatação do banco
    } catch (e) {
      console.error(e)
      show({ title: 'Erro ao salvar as configurações', variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-white">Carregando configurações...</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gold-500 flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Configurações da Calculadora de Rescisão
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gold-500 hover:bg-gold-600 text-gray-900 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
        <p className="text-gray-300 mb-6">
          Atualize os valores anuais do salário mínimo, INSS e Imposto de Renda. Esses valores serão utilizados para calcular os impostos e deduções nas rescisões de forma dinâmica.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Seção Básica */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Valores Gerais</h3>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Salário Mínimo (R$)</label>
              <input type="number" step="0.01" value={settings.salario_minimo} onChange={e => handleChange('salario_minimo', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Salário Família (R$ / filho)</label>
              <input type="number" step="0.01" value={settings.salario_familia} onChange={e => handleChange('salario_familia', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Teto Máximo do INSS (R$)</label>
              <input type="number" step="0.01" value={settings.teto_inss} onChange={e => handleChange('teto_inss', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
            </div>
          </div>

          {/* Tabela INSS */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Tabela INSS (Progressiva)</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Limite Faixa 1 (R$)</label>
                <input type="number" step="0.01" value={settings.inss_faixa1_limite} onChange={e => handleChange('inss_faixa1_limite', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Alíquota Faixa 1 (ex: 0.075 = 7.5%)</label>
                <input type="number" step="0.001" value={settings.inss_faixa1_aliquota} onChange={e => handleChange('inss_faixa1_aliquota', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Limite Faixa 2 (R$)</label>
                <input type="number" step="0.01" value={settings.inss_faixa2_limite} onChange={e => handleChange('inss_faixa2_limite', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Alíquota Faixa 2 (ex: 0.09 = 9%)</label>
                <input type="number" step="0.001" value={settings.inss_faixa2_aliquota} onChange={e => handleChange('inss_faixa2_aliquota', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Limite Faixa 3 (R$)</label>
                <input type="number" step="0.01" value={settings.inss_faixa3_limite} onChange={e => handleChange('inss_faixa3_limite', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Alíquota Faixa 3 (ex: 0.12 = 12%)</label>
                <input type="number" step="0.001" value={settings.inss_faixa3_aliquota} onChange={e => handleChange('inss_faixa3_aliquota', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Limite Faixa 4 (Teto) (R$)</label>
                <input type="number" step="0.01" value={settings.inss_faixa4_limite} onChange={e => handleChange('inss_faixa4_limite', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Alíquota Faixa 4 (ex: 0.14 = 14%)</label>
                <input type="number" step="0.001" value={settings.inss_faixa4_aliquota} onChange={e => handleChange('inss_faixa4_aliquota', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Tabela IRRF (Imposto de Renda)</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Dedução por Dependente (R$)</label>
                <input type="number" step="0.01" value={settings.irrf_deducao_dependente} onChange={e => handleChange('irrf_deducao_dependente', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Desconto Simplificado Opcional (R$)</label>
                <input type="number" step="0.01" value={settings.irrf_desconto_simplificado} onChange={e => handleChange('irrf_desconto_simplificado', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Limite de Isenção (Faixa 1) (R$)</label>
                <input type="number" step="0.01" value={settings.irrf_faixa1_limite} onChange={e => handleChange('irrf_faixa1_limite', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Limite Fx 2 (R$)</label>
                  <input type="number" step="0.01" value={settings.irrf_faixa2_limite} onChange={e => handleChange('irrf_faixa2_limite', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Alíquota</label>
                  <input type="number" step="0.001" value={settings.irrf_faixa2_aliquota} onChange={e => handleChange('irrf_faixa2_aliquota', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Dedução (R$)</label>
                  <input type="number" step="0.01" value={settings.irrf_faixa2_deducao} onChange={e => handleChange('irrf_faixa2_deducao', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Limite Fx 3 (R$)</label>
                  <input type="number" step="0.01" value={settings.irrf_faixa3_limite} onChange={e => handleChange('irrf_faixa3_limite', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Alíquota</label>
                  <input type="number" step="0.001" value={settings.irrf_faixa3_aliquota} onChange={e => handleChange('irrf_faixa3_aliquota', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Dedução (R$)</label>
                  <input type="number" step="0.01" value={settings.irrf_faixa3_deducao} onChange={e => handleChange('irrf_faixa3_deducao', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Limite Fx 4 (R$)</label>
                  <input type="number" step="0.01" value={settings.irrf_faixa4_limite} onChange={e => handleChange('irrf_faixa4_limite', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Alíquota</label>
                  <input type="number" step="0.001" value={settings.irrf_faixa4_aliquota} onChange={e => handleChange('irrf_faixa4_aliquota', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Dedução (R$)</label>
                  <input type="number" step="0.01" value={settings.irrf_faixa4_deducao} onChange={e => handleChange('irrf_faixa4_deducao', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Faixa 5 (Acima Fx4)</label>
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-gray-500 cursor-not-allowed">∞</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Alíquota</label>
                  <input type="number" step="0.001" value={settings.irrf_faixa5_aliquota} onChange={e => handleChange('irrf_faixa5_aliquota', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Dedução (R$)</label>
                  <input type="number" step="0.01" value={settings.irrf_faixa5_deducao} onChange={e => handleChange('irrf_faixa5_deducao', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
