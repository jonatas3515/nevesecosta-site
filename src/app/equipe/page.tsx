'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type TeamMember = {
  id: string
  slug: string
  name: string
  oab?: string | null
  photo_url?: string | null
  specialties?: string[] | null
}

export default function EquipePage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('team_members')
          .select('id, slug, name, oab, photo_url, specialties')
          .order('name')
        if (err) throw err
        setMembers((data as TeamMember[]) || [])
      } catch (e: any) {
        console.error('[Equipe] load error:', e)
        setError('Não foi possível carregar a equipe. Tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Nossa Equipe</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-gold-400 hover:text-gold-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar ao Início
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nossa Equipe
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Conheça os profissionais que fazem a diferença na Neves & Costa Advocacia
          </p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-300 text-lg">Nenhum membro da equipe cadastrado no momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-gray-900 rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/50 transition-all"
              >
                {/* Foto */}
                <div className="mb-6 flex justify-center">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-500/20">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        width={300}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-[300px] h-[400px] flex items-center justify-center bg-gray-800 text-gray-400">
                        <User size={64} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {member.name}
                  </h2>

                  {member.oab && (
                    <p className="text-gold-400 font-semibold mb-4">
                      {member.oab}
                    </p>
                  )}

                  {(member.specialties || []).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        Especialidades:
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        {member.specialties!.map((specialty) => (
                          <span
                            key={specialty}
                            className="bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-sm border border-gold-500/30"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/equipe/${member.slug}`}
                    className="inline-flex items-center bg-gold-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
                  >
                    <ExternalLink size={18} className="mr-2" />
                    Ver Currículo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gray-900 rounded-2xl p-8 border border-gold-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Precisa de Ajuda Jurídica?
          </h2>
          <p className="text-gray-300 mb-6">
            Nossa equipe está pronta para cuidar do seu direito com dedicação e expertise.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/areas"
              className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Áreas de Atuação
            </Link>
            <Link
              href="/blog"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/#contato"
              className="inline-block bg-gold-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
            >
              Entre em Contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
