'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail, GraduationCap, User, AtSign, Calendar, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Props { params: { slug: string } }

type TeamMember = {
  id: string
  slug: string
  name: string
  oab?: string | null
  photo_url?: string | null
  specialties?: string[] | null
  bio?: string | null
  curriculum?: string | null
  lattes_id?: string | null
  lattes_url?: string | null
  lattes_updated_at?: string | null
  email?: string | null
  social_media?: string | null
  updated_at?: string | null
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function TeamMemberPage({ params }: Props) {
  const { slug } = params
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      if (error) throw error
      setMember(data as TeamMember | null)
    } catch (e) {
      console.error('[TeamMember] load error', e)
      setMember(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [slug])

  // Loading state
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

  // Not found state
  if (!member) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-4 py-12">
          <Link href="/equipe" className="inline-flex items-center text-gold-400 hover:text-gold-300 mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Voltar à Equipe
          </Link>
          <div className="bg-gray-900 rounded-2xl p-8 border border-gold-500/20 text-center">
            <User size={64} className="mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Profissional não encontrado</h2>
            <p className="text-gray-400">O currículo solicitado não está disponível.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Botão Voltar */}
        <div className="mb-8">
          <Link
            href="/equipe"
            className="inline-flex items-center text-gold-400 hover:text-gold-300 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar à Equipe
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">

          {/* Coluna Esquerda: Foto e Informações Básicas */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gold-500/20 sticky top-24">
              {/* Foto */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-500/30 mb-6">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt={member.name}
                    width={400}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-[500px] flex items-center justify-center bg-gray-800 text-gray-400">
                    <User size={96} />
                  </div>
                )}
              </div>

              {/* Nome e OAB */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">{member.name}</h1>
                {member.oab && (
                  <p className="text-gold-400 font-semibold">{member.oab}</p>
                )}
              </div>

              {/* Link Lattes */}
              {member.lattes_url && (
                <div className="border-t border-gold-500/20 pt-4">
                  <a
                    href={member.lattes_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 px-4 py-3 rounded-lg transition-colors w-full"
                  >
                    <Image src="/Lattes.png" alt="Lattes" width={140} height={40} className="h-8 w-auto" />
                  </a>
                  {member.lattes_updated_at && (
                    <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                      <Calendar size={12} />
                      Atualizado em {formatDate(member.lattes_updated_at)}
                    </p>
                  )}
                </div>
              )}

              {/* Contato */}
              {(member.email || member.social_media) && (
                <div className="border-t border-gold-500/20 pt-4 mt-4 space-y-2">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors text-sm"
                    >
                      <Mail size={16} className="text-gold-500" />
                      {member.email}
                    </a>
                  )}
                  {member.social_media && (
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <AtSign size={16} className="text-gold-500" />
                      {member.social_media}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita: Conteúdo do Currículo */}
          <div className="md:col-span-2 space-y-8">
            {/* Card 1: Sobre (Biografia/Resumo) */}
            {member.bio && (
              <section className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gold-500/20">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <Award size={32} className="text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gold-400 text-center">Sobre</h2>
                </div>
                <p className="text-gray-300 leading-7 whitespace-pre-line text-center">
                  {member.bio}
                </p>
              </section>
            )}

            {/* Card 2: Formação Acadêmica/Titulação */}
            {member.curriculum && (
              <section className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gold-500/20">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <GraduationCap size={32} className="text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gold-400 text-center">Formação Acadêmica/Titulação</h2>
                </div>
                <div className="text-gray-300 leading-7 whitespace-pre-line text-center">
                  {member.curriculum}
                </div>
              </section>
            )}

            {/* Card 3: Áreas de Especialização */}
            {(member.specialties || []).length > 0 && (
              <section className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gold-500/20">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <Award size={32} className="text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gold-400 text-center">Áreas de Especialização</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {(member.specialties || []).map((specialty) => (
                    <span
                      key={specialty}
                      className="bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full border border-gold-500/30 font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
