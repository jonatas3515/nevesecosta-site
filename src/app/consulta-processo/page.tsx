'use client'

import { ExternalLink, Scale, Gavel, Building2 } from 'lucide-react'

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
  
  // Tribunais Federais
  {
    id: 'trf1-1g',
    name: 'TRF1 1° Grau',
    fullName: 'Tribunal Regional Federal 1ª Região - 1° Grau',
    url: 'https://pje1g.trf1.jus.br/consultapublica/ConsultaPublica/listView.seam',
    color: 'bg-blue-500',
    icon: '🏛️',
    category: 'federal'
  },
  {
    id: 'trf1-2g',
    name: 'TRF1 2° Grau',
    fullName: 'Tribunal Regional Federal 1ª Região - 2° Grau',
    url: 'https://pje2g.trf1.jus.br/consultapublica/ConsultaPublica/listView.seam',
    color: 'bg-blue-600',
    icon: '🏛️',
    category: 'federal'
  },
  
  // Tribunal do Trabalho
  {
    id: 'trt5',
    name: 'TRT5',
    fullName: 'Tribunal Regional do Trabalho 5ª Região - BA',
    url: 'https://pje.trt5.jus.br/consultaprocessual/',
    color: 'bg-green-500',
    icon: '👷',
    category: 'trabalhista'
  },
  
  // Tribunal Eleitoral
  {
    id: 'tre-ba',
    name: 'TRE-BA',
    fullName: 'Tribunal Regional Eleitoral da Bahia',
    url: 'https://consultaunificadapje.tse.jus.br/#/public/inicial/index',
    color: 'bg-yellow-500',
    icon: '🗳️',
    category: 'eleitoral'
  },
  
  // Tribunais Superiores
  {
    id: 'stj',
    name: 'STJ',
    fullName: 'Superior Tribunal de Justiça',
    url: 'https://processo.stj.jus.br/processo/pesquisa/?aplicacao=processos.ea',
    color: 'bg-gray-600',
    icon: '🏛️',
    category: 'superior'
  },
  
  // Outros Estados (principais)
  {
    id: 'tjrj-1g',
    name: 'TJRJ 1° Grau',
    fullName: 'Tribunal de Justiça do Rio de Janeiro - 1° Grau',
    url: 'https://tjrj.pje.jus.br/pje/ConsultaPublica/listView.seam',
    color: 'bg-orange-500',
    icon: '⚖️',
    category: 'estadual'
  },
  {
    id: 'tjsp-1g',
    name: 'TJSP 1° Grau',
    fullName: 'Tribunal de Justiça de São Paulo - 1° Grau',
    url: 'https://esaj.tjsp.jus.br/cpopg/open.do',
    color: 'bg-purple-500',
    icon: '⚖️',
    category: 'estadual'
  },
  {
    id: 'tjsp-2g',
    name: 'TJSP 2° Grau',
    fullName: 'Tribunal de Justiça de São Paulo - 2° Grau',
    url: 'https://esaj.tjsp.jus.br/cposg/open.do',
    color: 'bg-purple-600',
    icon: '⚖️',
    category: 'estadual'
  },
  {
    id: 'tjmg-1g',
    name: 'TJMG 1° Grau',
    fullName: 'Tribunal de Justiça de Minas Gerais - 1° Grau',
    url: 'https://pje-consulta-publica.tjmg.jus.br/',
    color: 'bg-indigo-500',
    icon: '⚖️',
    category: 'estadual'
  }
]

const categories = {
  estadual: { name: 'Justiça Estadual', icon: Scale, color: 'text-red-500' },
  federal: { name: 'Justiça Federal', icon: Building2, color: 'text-blue-500' },
  trabalhista: { name: 'Justiça do Trabalho', icon: Gavel, color: 'text-green-500' },
  eleitoral: { name: 'Justiça Eleitoral', icon: Building2, color: 'text-yellow-500' },
  superior: { name: 'Tribunais Superiores', icon: Building2, color: 'text-gray-500' }
}

export default function ConsultaProcesso() {
  const handleTribunalClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const groupedTribunais = Object.entries(categories).map(([key, category]) => ({
    category: key as keyof typeof categories,
    ...category,
    tribunais: tribunais.filter(t => t.category === key)
  }))

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

          {/* Tribunais por Categoria */}
          {groupedTribunais.map(({ category, name, icon: CategoryIcon, color, tribunais: categoryTribunais }) => (
            <div key={category} className="mb-12">
              <div className="flex items-center mb-6">
                <CategoryIcon className={`${color} mr-3`} size={32} />
                <h2 className="text-2xl font-bold text-white">{name}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTribunais.map((tribunal) => (
                  <button
                    key={tribunal.id}
                    onClick={() => handleTribunalClick(tribunal.url)}
                    className={`${tribunal.color} hover:opacity-90 transition-all duration-300 transform hover:scale-105 p-6 rounded-xl shadow-lg group`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">{tribunal.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {tribunal.name}
                      </h3>
                      <p className="text-white/80 text-sm mb-4 line-clamp-2">
                        {tribunal.fullName}
                      </p>
                      <div className="flex items-center justify-center text-white/90 group-hover:text-white">
                        <span className="text-sm font-medium mr-2">Acessar</span>
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

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
    </div>
  )
}
