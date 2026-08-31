/**
 * Avaliações reais do Google Maps
 * Dados extraídos do perfil do escritório Neves & Costa
 */

export interface GoogleReview {
  id: number
  name: string
  role: string
  rating: number
  comment: string
  date: string
}

export const googleReviews: GoogleReview[] = [
  {
    id: 1,
    name: "Edmario Ramos Pedreira",
    role: "Cliente Google",
    rating: 5,
    comment: "Excelente atendimento e profissionalismo. Recomendo!",
    date: "2024-07-15"
  },
  {
    id: 2,
    name: "Gilvan Santana",
    role: "Cliente Google",
    rating: 5,
    comment: "Atendimento excepcional, muito satisfeito com o resultado.",
    date: "2024-06-20"
  },
  {
    id: 3,
    name: "Rogerio Araujo Costa",
    role: "Local Guide • 18 avaliações",
    rating: 5,
    comment: "Já me ajudou algumas vezes, sempre com muita paciência e competência. Sem dúvida é o melhor de Itamaraju e extremo sul da Bahia.",
    date: "2024-06-20"
  },
  {
    id: 4,
    name: "Daniella Silva",
    role: "Cliente Google",
    rating: 5,
    comment: "A atenção aos detalhes, a agilidade nas respostas e o comprometimento com os resultados superaram minhas expectativas. Sem dúvida, é um escritório que preza pela ética, excelência e respeito ao cliente.",
    date: "2024-05-25"
  },
  {
    id: 5,
    name: "Luane Salles",
    role: "Cliente Google",
    rating: 5,
    comment: "Atencioso e presente em todos os questionamentos, um profissional excelente.",
    date: "2024-05-25"
  },
  {
    id: 6,
    name: "Guda Dias",
    role: "Cliente Google",
    rating: 5,
    comment: "Excelente atendimento e dedicação aos clientes.",
    date: "2024-05-25"
  },
  {
    id: 7,
    name: "Mateus Torres",
    role: "Cliente Google",
    rating: 5,
    comment: "Parabéns ao escritório pelo excelente trabalho! Profissionalismo, dedicação e compromisso com os clientes são qualidades que fazem toda a diferença. Continuem sendo referência em advocacia e justiça! Recomendo 👍 👍",
    date: "2024-05-25"
  },
  {
    id: 8,
    name: "Amanda Santos",
    role: "Cliente Google",
    rating: 5,
    comment: "Atendimento excepcional e resultados satisfatórios.",
    date: "2024-05-25"
  },
  {
    id: 9,
    name: "Nathan Falcão",
    role: "Cliente Google",
    rating: 5,
    comment: "São ótimos advogados, bom atendimento, prestativos, compreensivo, sem dúvida nenhuma se eu precisar são eles que vou procurar sempre",
    date: "2024-05-25"
  },
  {
    id: 10,
    name: "Isnaldo Souza",
    role: "Cliente Google",
    rating: 5,
    comment: "Excelente escritório de advocacia, recomendo!",
    date: "2024-05-25"
  },
  {
    id: 11,
    name: "Edcarlos Santos",
    role: "Local Guide • 12 avaliações",
    rating: 5,
    comment: "Ótimo atendimento, recomendo",
    date: "2024-05-25"
  },
  {
    id: 12,
    name: "Leonardo Santos",
    role: "Local Guide • 7 avaliações",
    rating: 5,
    comment: "Ótimo atendimento, e mantém o cliente sempre informado sobre o processo. Indico.",
    date: "2024-05-25"
  },
  {
    id: 13,
    name: "Italio NeVveS",
    role: "Cliente Google",
    rating: 5,
    comment: "Excelente escritório! Atendimento rápido, equipe atenciosa e que realmente resolve. Fiquei muito satisfeito com o serviço e recomendo.",
    date: "2024-05-25"
  },
  {
    id: 14,
    name: "Danilo Costa",
    role: "Local Guide • 17 avaliações",
    rating: 5,
    comment: "Já precisei dos serviços da Neves & Costa Advocacia algumas vezes e sempre fui muito bem atendido. O Jonatas, em especial, é extremamente atencioso, profissional e dedicado, sempre esclarecendo todas as dúvidas e conduzindo os processos com agilidade e transparência. Recomendo fortemente o escritório para quem busca um atendimento de qualidade e confiança.",
    date: "2024-05-25"
  },
  {
    id: 15,
    name: "Uanatas Costa",
    role: "Cliente Google",
    rating: 5,
    comment: "Advogados bem empenhados em resolução de problemas. Parabéns a todos",
    date: "2024-05-25"
  }
]
