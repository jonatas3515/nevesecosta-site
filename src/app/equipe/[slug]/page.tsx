'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail, GraduationCap, User, AtSign, Calendar, Award, Phone, BookOpen, Briefcase } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'isomorphic-dompurify'
import { TeamComplementaryBlock, TeamAcademicEducation, TeamProfessionalExperience, TeamSpecializationArea } from '@/types'

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
  phone?: string | null
  academic_education?: string | null
  complementary_training?: string | null
  professional_experience?: string | null
  updated_at?: string | null
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})

const allowedTeamTags = [
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'ul', 'ol', 'li',
  'a',
  'div', 'span',
  'blockquote',
  'pre', 'code',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'img',
]

const allowedTeamAttrs = ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class']

function renderMarkdown(text: string | null | undefined): string {
  if (!text) return ''
  const raw = md.render(text)
  let clean = DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: allowedTeamTags,
    ALLOWED_ATTR: allowedTeamAttrs,
    ALLOW_DATA_ATTR: false,
  })
  clean = clean.replace(
    /<a\s+([^>]*?)target="_blank"([^>]*?)>/gi,
    (match, before, after) => {
      if (/rel=["']/.test(match)) return match
      return `<a ${before}target="_blank" rel="noopener noreferrer"${after}>`
    }
  )
  return clean
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
  const [complementaryBlocks, setComplementaryBlocks] = useState<TeamComplementaryBlock[]>([])
  const [academicBlocks, setAcademicBlocks] = useState<TeamAcademicEducation[]>([])
  const [experienceBlocks, setExperienceBlocks] = useState<TeamProfessionalExperience[]>([])
  const [specializationBlocks, setSpecializationBlocks] = useState<TeamSpecializationArea[]>([])
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

      if (data) {
        const [
          { data: compBlocks, error: compError },
          { data: acadBlocks, error: acadError },
          { data: expBlocks, error: expError },
          { data: specBlocks, error: specError },
        ] = await Promise.all([
          supabase.from('team_complementary_blocks').select('*').eq('member_id', data.id).order('sort_order', { ascending: true }),
          supabase.from('team_academic_education').select('*').eq('member_id', data.id).order('sort_order', { ascending: true }),
          supabase.from('team_professional_experience').select('*').eq('member_id', data.id).order('sort_order', { ascending: true }),
          supabase.from('team_specialization_areas').select('*').eq('member_id', data.id).order('sort_order', { ascending: true }),
        ])
        if (compError) throw compError
        if (acadError) throw acadError
        if (expError) throw expError
        if (specError) throw specError
        setComplementaryBlocks((compBlocks || []) as TeamComplementaryBlock[])
        setAcademicBlocks((acadBlocks || []) as TeamAcademicEducation[])
        setExperienceBlocks((expBlocks || []) as TeamProfessionalExperience[])
        setSpecializationBlocks((specBlocks || []) as TeamSpecializationArea[])
      } else {
        setComplementaryBlocks([])
        setAcademicBlocks([])
        setExperienceBlocks([])
        setSpecializationBlocks([])
      }
    } catch (e) {
      console.error('[TeamMember] load error', e)
      setMember(null)
      setComplementaryBlocks([])
      setAcademicBlocks([])
      setExperienceBlocks([])
      setSpecializationBlocks([])
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
                    <Image src="/Lattes.png" alt="Lattes" width={180} height={48} className="h-10 w-auto" />
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
              {(member.email || member.phone || member.social_media) && (
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
                  {member.phone && (
                    <a
                      href={`https://wa.me/${member.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors text-sm"
                    >
                      <Phone size={16} className="text-gold-500" />
                      {member.phone}
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
            {/* Sobre */}
            {member.bio && (
              <section className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gold-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Award size={28} className="text-gold-400" />
                  <h2 className="text-2xl font-bold text-gold-400">Sobre</h2>
                </div>
                <div className="team-markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(member.bio) }} />
              </section>
            )}

            {/* Formação Acadêmica */}
            {academicBlocks.length > 0 && (
              <section className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gold-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap size={28} className="text-gold-400" />
                  <h2 className="text-2xl font-bold text-gold-400">Formação Acadêmica</h2>
                </div>
                <div className="space-y-4">
                  {academicBlocks.map((item) => (
                    <div
                      key={item.id}
                      className="border-l-2 border-amber-500 pl-4 py-2"
                    >
                      <div className="font-bold text-base text-white">{item.course_name}</div>
                      <div className="text-xs text-slate-400">{item.period}</div>
                      <div className="text-sm text-slate-300">{item.institution}</div>
                      {item.thesis_title && (
                        <div className="text-sm text-slate-400 mt-1">Título: {item.thesis_title}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Formação Complementar */}
            {complementaryBlocks.length > 0 && (
              <section className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gold-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen size={28} className="text-gold-400" />
                  <h2 className="text-2xl font-bold text-gold-400">Formação Complementar</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complementaryBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50"
                    >
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: block.title_color }}
                      >
                        {block.category_title}
                      </h3>
                      <div
                        className="space-y-1 text-sm whitespace-pre-line"
                        style={{ color: block.text_color, textAlign: block.text_align }}
                      >
                        {block.courses_text.split('\n').filter(line => line.trim()).map((line, i) => (
                          <p key={i} className="leading-relaxed">{line.trim()}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experiência Profissional */}
            {experienceBlocks.length > 0 && (
              <section className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gold-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase size={28} className="text-gold-400" />
                  <h2 className="text-2xl font-bold text-gold-400">Experiência Profissional</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {experienceBlocks.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
                    >
                      <div className="font-bold text-gold-400 text-lg">{item.role_title}</div>
                      <div className="text-xs text-slate-400 mb-2">{item.period}</div>
                      <p className="text-sm text-slate-300 whitespace-pre-line">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Áreas de Especialização */}
            {specializationBlocks.length > 0 && (
              <section className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gold-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Award size={28} className="text-gold-400" />
                  <h2 className="text-2xl font-bold text-gold-400">Áreas de Especialização</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {specializationBlocks.slice(0, 3).map((block) => (
                    <div
                      key={block.id}
                      className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50"
                    >
                      <h3 className="text-lg font-semibold text-gold-400 mb-3">{block.area_title}</h3>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {block.topics_list
                          .split(/\n|,/)
                          .map(t => t.trim())
                          .filter(Boolean)
                          .map((topic, i) => (
                            <li key={i}>{topic}</li>
                          ))}
                      </ul>
                    </div>
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
