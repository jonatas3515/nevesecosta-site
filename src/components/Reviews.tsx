'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
  id: number
  name: string
  role: string
  rating: number
  comment: string
  date: string
}

// Avaliações reais do Google
const googleReviews: Review[] = [
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

const initialReviews: Review[] = [...googleReviews]

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    comment: '',
  })

  // Auto-play do carrossel a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % googleReviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newReview: Review = {
      id: Date.now(), // Usar timestamp para ID único
      ...formData,
      role: 'Novo Cliente',
      date: new Date().toISOString().split('T')[0],
    }
    // Adicionar nova avaliação no início, mantendo as do Google
    setReviews([newReview, ...googleReviews])
    setFormData({ name: '', role: '', rating: 5, comment: '' })
    setShowForm(false)
  }

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % googleReviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + googleReviews.length) % googleReviews.length)
  }

  const averageRating = googleReviews.reduce((acc, review) => acc + review.rating, 0) / googleReviews.length

  return (
    <section id="avaliacoes" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              A satisfação dos nossos clientes é nossa maior conquista
            </p>
            
            {/* Rating Summary */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`${
                      star <= averageRating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'
                    }`}
                    size={24}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</span>
              <span className="text-gray-300">({googleReviews.length} avaliações)</span>
            </div>
          </div>

          {/* Avaliações do Google - Integradas */}
          <div className="mb-12 max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border border-gold-500/20">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <h3 className="text-2xl font-bold text-white">Avaliações no Google</h3>
              </div>
              
              {/* Carrossel de Avaliações */}
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {googleReviews.map((review) => (
                      <div key={review.id} className="w-full flex-shrink-0 px-4">
                        <div className="bg-gray-800 p-6 rounded-lg border border-gold-500/10 max-w-2xl mx-auto">
                          <div className="flex justify-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`${
                                  star <= review.rating
                                    ? 'text-gold-500 fill-gold-500'
                                    : 'text-gray-600'
                                }`}
                                size={20}
                              />
                            ))}
                          </div>
                          <Quote className="text-gold-500 mx-auto mb-4" size={32} />
                          <p className="text-gray-300 text-center mb-6 text-lg leading-relaxed">
                            "{review.comment}"
                          </p>
                          <div className="text-center">
                            <p className="font-semibold text-white text-lg">{review.name}</p>
                            <p className="text-gray-400 text-sm">{review.role}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(review.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Controles do Carrossel */}
                <button
                  onClick={prevReview}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gold-500 text-gray-900 p-2 rounded-full hover:bg-gold-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextReview}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gold-500 text-gray-900 p-2 rounded-full hover:bg-gold-600 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Indicadores */}
                <div className="flex justify-center mt-6 space-x-2">
                  {googleReviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-gold-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-center text-gray-400 mt-6">
                Confira todas as nossas avaliações no Google e deixe a sua também!
              </p>
            </div>
          </div>

          {/* Carrossel removido conforme solicitado */}

          {/* Add Review Button */}
          {!showForm && (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="bg-gold-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
              >
                Deixe Sua Avaliação
              </button>
            </div>
          )}

          {/* Review Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Deixe Sua Avaliação</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Seu Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Digite seu nome"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Área de Atendimento</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: Cliente - Direito Civil"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Avaliação</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`${
                            star <= formData.rating
                              ? 'text-gold-500 fill-gold-500'
                              : 'text-gray-300'
                          } hover:text-gold-400 transition-colors`}
                          size={32}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Seu Comentário</label>
                  <textarea
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Compartilhe sua experiência conosco..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gold-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
                  >
                    Enviar Avaliação
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
