'use client'

import React from 'react'
import { ExternalLink, Scale, Gavel, Building2 } from 'lucide-react'
import Image from 'next/image'

interface Tribunal {
  id: string
  name: string
  fullName: string
  url: string
  color: string
  icon: string
  category: 'estadual' | 'federal' | 'trabalhista' | 'eleitoral' | 'superior'
}

const tribunais: Tribunal[] = [
  // Tribunais Estaduais da Bahia
  {
    id: 'tjba-1g',
    name: 'TJBA 1° Grau',
    fullName: 'Tribunal de Justiça da Bahia - 1° Grau',
    url: 'https://consultapublicapje.tjba.jus.br/pje/ConsultaPublica/listView.seam',
    color: 'bg-red-500',
    icon: '⚖️',
    category: 'estadual'
  },
  {
    id: 'tjba-2g',
    name: 'TJBA 2° Grau',
    fullName: 'Tribunal de Justiça da Bahia - 2° Grau',
    url: 'https://pje2g.tjba.jus.br/pje/ConsultaPublica/listView.seam',
    color: 'bg-red-600',
    icon: '⚖️',
    category: 'estadual'
  },
  {
    id: 'projudi-ba',
    name: 'Projudi BA',
    fullName: 'Processo Judicial Digital - Bahia',
    url: 'https://projudi.tjba.jus.br/projudi/',
    color: 'bg-pink-500',
    icon: '💻',
    category: 'estadual'
  },
  
  // Tribunais Estaduais do Rio de Janeiro
  {
    id: 'tjrj-1g',
    name: 'TJRJ',
    fullName: 'Tribunal de Justiça do Rio de Janeiro',
    url: 'https://www4.tjrj.jus.br/consultaProcessoNome/consultaProcNome.do',
    color: 'bg-pink-600',
    icon: '⚖️',
    category: 'estadual'
  },
  // Tribunais Estaduais de São Paulo (exemplo)
  {
    id: 'tjsp-1g',
    name: 'TJSP 1° Grau',
    fullName: 'Tribunal de Justiça de São Paulo - 1° Grau',
    url: 'https://esaj.tjsp.jus.br/cpopg/open.do',
    color: 'bg-purple-600',
    icon: '⚖️',
    category: 'estadual'
  },
  {
    id: 'tjsp-2g',
    name: 'TJSP 2° Grau',
    fullName: 'Tribunal de Justiça de São Paulo - 2° Grau',
    url: 'https://esaj.tjsp.jus.br/cposg/open.do',
    color: 'bg-purple-700',
    icon: '⚖️',
    category: 'estadual'
  },
  // Tribunais de Minas Gerais
  {
    id: 'tjmg-1g',
    name: 'TJMG 1° Grau',
    fullName: 'Tribunal de Justiça de Minas Gerais - 1° Grau',
    url: 'https://pje-consulta-publica.tjmg.jus.br/',
    color: 'bg-indigo-500',
    icon: '⚖️',
    category: 'estadual'
  },
  {
    id: 'tjmg-recursal',
    name: 'TJMG Recursal',
    fullName: 'Tribunal de Justiça de Minas Gerais - Turmas Recursais',
    url: 'https://pjerecursal.tjmg.jus.br/pje/ConsultaPublica/listView.seam',
    color: 'bg-indigo-600',
    icon: '⚖️',
    category: 'estadual'
  },
  // Justiça Federal (TRF1 1º e 2º)
  {
    id: 'trf1-1g',
    name: 'TRF1 1° Grau',
    fullName: 'Tribunal Regional Federal da 1ª Região - 1° Grau',
    url: 'https://processual.trf1.jus.br/consultaProcessual/portal/trf1/consulta.jsf',
    color: 'bg-blue-600',
    icon: '🏛️',
    category: 'federal'
  },
  {
    id: 'trf1-2g',
    name: 'TRF1 2° Grau',
    fullName: 'Tribunal Regional Federal da 1ª Região - 2° Grau',
    url: 'https://processual.trf1.jus.br/consultaProcessual/portal/trf1/consulta.jsf',
    color: 'bg-blue-700',
    icon: '🏛️',
    category: 'federal'
  },
  // Justiça do Trabalho (ex.: TRT5)
  {
    id: 'trt5',
    name: 'TRT5',
    fullName: 'Tribunal Regional do Trabalho da 5ª Região',
    url: 'https://consulta.trt5.jus.br/',
    color: 'bg-green-800',
    icon: '⚒️',
    category: 'trabalhista'
  },
  // Tribunais Superiores (ex.: STJ)
  {
    id: 'stj',
    name: 'STJ',
    fullName: 'Superior Tribunal de Justiça',
    url: 'https://processo.stj.jus.br/processo/',
    color: 'bg-green-700',
    icon: '🏛️',
    category: 'superior'
  },
  // Justiça Eleitoral: manter apenas TSE
  {
    id: 'tse',
    name: 'TSE',
    fullName: '',
    url: 'https://www.tse.jus.br/servicos/eleitorais/consulta-processual',
    color: 'bg-green-600',
    icon: '🗳️',
    category: 'eleitoral'
  },
]

// Ordem ajustada: Estadual, Federal, Justiça do Trabalho, Tribunais Superiores, Justiça Eleitoral
const categories = {
  estadual: { name: 'Justiça Estadual', icon: Scale, color: 'text-red-500' },
  federal: { name: 'Justiça Federal', icon: Building2, color: 'text-blue-500' },
  trabalhista: { name: 'Justiça do Trabalho', icon: Gavel, color: 'text-green-500' },
  superior: { name: 'Tribunais Superiores', icon: Building2, color: 'text-green-700' },
  eleitoral: { name: 'Justiça Eleitoral', icon: Building2, color: 'text-green-900' },
}

export default function ConsultaProcesso() {
  const handleTribunalClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  };

  // Ordem explícita de seções (todas padronizadas em 4 colunas)
  const categoryOrder: (keyof typeof categories)[] = ['estadual', 'federal', 'trabalhista', 'superior', 'eleitoral']

  const groupedTribunais = categoryOrder.map((key) => ({
    category: key,
    ...categories[key],
    tribunais: tribunais.filter(t => t.category === key)
  }))

  // Mapeamento das imagens reais na pasta /public conforme nomes fornecidos
  const getLogos = (tribunalId: string): string[] => {
    switch (tribunalId) {
      // Projudi BA: apenas Projudi
      case 'projudi-ba':
        return ['/Projudi.png']
      // Bahia: PJe + TJBA (1°/2°)
      case 'tjba-1g':
        return ['/TJBA1e2.png']
      case 'tjba-2g':
        return ['/TJBA1e2.png']
      // Minas Gerais: PJe + TJMG (1°/Recursal)
      case 'tjmg-1g':
        return ['/TJMG1eRecursal.png']
      case 'tjmg-recursal':
        return ['/TJMG1eRecursal.png']
      // Justiça Federal TRF1: PJe + TRF (1°/2°)
      case 'trf1-1g':
        return ['/TRF1e2.png']
      case 'trf1-2g':
        return ['/TRF1e2.png']
      // Justiça do Trabalho TRT5: PJe + TRT5
      case 'trt5':
        return ['/TRT5.ico']
      // TJRJ: apenas TJRJ
      case 'tjrj-1g':
        return ['/TJRJ.png']
      // STJ: apenas STJ
      case 'stj':
        return ['/STJ.png']
      // TSE: apenas TSE
      case 'tse':
        return ['/TSE.png']
      // SP (placeholders atuais)
      case 'tjsp-1g':
        return ['/TJSP.png']
      case 'tjsp-2g':
        return ['/TJSP.png']
      default:
        return []
    }
  }

  // Helper: URL por id já cadastrado em `tribunais`
  const getUrlById = (id: string) => tribunais.find(t => t.id === id)?.url || '#'
  // Helper: card clicável baseado em imagem pronta do /public
  const renderCard = (id: string, src: string, alt: string) => (
    <a
      key={id}
      href={getUrlById(id)}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.01]"
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={800}
        className="w-full h-auto object-contain bg-transparent"
        unoptimized
        priority={false}
      />
    </a>
  )

  // Helper: card com URL customizado (sobrescreve o cadastrado)
  const renderCardWithUrl = (id: string, src: string, alt: string, url: string) => (
    <a
      key={id}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.01]"
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={800}
        className="w-full h-auto object-contain bg-transparent"
        unoptimized
        priority={false}
      />
    </a>
  )

  return (
    <div className="min-h-screen bg-black text-white pt-32">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Consulte seu Processo Aqui
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Acesse diretamente os sistemas de consulta processual dos principais tribunais do Brasil
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-yellow-300 text-sm">
                <strong>Dica:</strong> Tenha em mãos o número do seu processo para facilitar a consulta
              </p>
            </div>
          </div>

          {/* Justiça Estadual */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Scale className={`${categories.estadual.color} mr-3`} size={32} />
              <h2 className="text-2xl font-bold text-white">Justiça Estadual</h2>
            </div>
            {/* Linha 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {renderCard('tjba-1g', '/TJBA1.png', 'TJBA 1º Grau')}
              {renderCard('tjba-2g', '/TJBA2.png', 'TJBA 2º Grau')}
              {renderCard('projudi-ba', '/Projudi.png', 'Projudi BA')}
            </div>
            {/* Linha 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {renderCard('tjmg-1g', '/TJMG1.png', 'TJMG 1º Grau')}
              {renderCard('tjmg-recursal', '/TJMG2.png', 'TJMG Recursal')}
              {renderCardWithUrl('tjrj-1g', '/TJRJ.png', 'TJRJ', 'https://tjrj.pje.jus.br/pje/ConsultaPublica/listView.seam')}
            </div>
            {/* Linha 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderCard('tjsp-1g', '/TJSP1.png', 'TJSP 1º Grau')}
              {renderCard('tjsp-2g', '/TJSP2.png', 'TJSP 2º Grau')}
              <div className="hidden md:block" />
            </div>
          </div>

          {/* Justiça Federal */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Building2 className={`${categories.federal.color} mr-3`} size={32} />
              <h2 className="text-2xl font-bold text-white">Justiça Federal</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderCardWithUrl('trf1-1g', '/TRF11.png', 'TRF1 1º Grau', 'https://pje1g.trf1.jus.br/consultapublica/ConsultaPublica/listView.seam')}
              {renderCardWithUrl('trf1-2g', '/TRF12.png', 'TRF1 2º Grau', 'https://pje2g.trf1.jus.br/consultapublica/ConsultaPublica/listView.seam')}
              <div className="hidden md:block" />
            </div>
          </div>

          {/* Linha final: Trabalho, Eleitoral, Superiores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Gavel className={`${categories.trabalhista.color} mr-3`} size={28} />
                <h3 className="text-xl font-semibold text-white">Justiça do Trabalho</h3>
              </div>
              {renderCardWithUrl(
                'trt5',
                '/TRT5.png',
                'TRT5',
                'https://pje.trt5.jus.br/consultaprocessual/'
              )}
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Building2 className={`${categories.eleitoral.color} mr-3`} size={28} />
                <h3 className="text-xl font-semibold text-white">Justiça Eleitoral</h3>
              </div>
              {renderCardWithUrl(
                'tse',
                '/TSE.png',
                'TSE',
                'https://consultaunificadapje.tse.jus.br/#/public/inicial/index'
              )}
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Building2 className={`${categories.superior.color} mr-3`} size={28} />
                <h3 className="text-xl font-semibold text-white">Tribunais Superiores</h3>
              </div>
              {renderCardWithUrl(
                'stj',
                '/STJ.png',
                'STJ',
                'https://processo.stj.jus.br/processo/pesquisa'
              )}
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-16 bg-gray-900 rounded-2xl p-8 border border-gold-500/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Como Consultar seu Processo
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gold-500 mb-4">
                  Informações Necessárias:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-2">•</span>
                    Número do processo (formato: NNNNNNN-DD.AAAA.J.TR.OOOO)
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-2">•</span>
                    Nome das partes (autor/réu)
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-2">•</span>
                    CPF/CNPJ (quando solicitado)
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-2">•</span>
                    Nome do advogado (opcional)
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gold-500 mb-4">
                  Dicas Importantes:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-2">•</span>
                    Escolha o tribunal correto onde seu processo tramita
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-2">•</span>
                    Processos podem migrar entre 1° e 2° graus
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-2">•</span>
                    Em caso de dúvida, consulte seu advogado
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-2">•</span>
                    Alguns tribunais podem estar em manutenção
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Precisa de ajuda com seu processo? 
                <a href="#contato" className="text-gold-500 hover:text-gold-400 ml-1">
                  Entre em contato conosco
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* CTAs de Links Internos */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-black border border-gold-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Precisa de assistência com seu processo?</h3>
            <p className="text-gray-300 mb-6">Conheça nossas áreas de atuação, leia o Blog ou fale com nossa equipe.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/areas" className="px-6 py-3 rounded-lg bg-gold-500 text-gray-900 font-semibold hover:bg-gold-600">Áreas de Atuação</a>
              <a href="/blog" className="px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700">Blog</a>
              <a href="/#contato" className="px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-200">Fale Conosco</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
