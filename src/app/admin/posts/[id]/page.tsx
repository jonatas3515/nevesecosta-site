'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })
const Markdown = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false })

export default function EditPost() {
  const params = useParams()
  const router = useRouter()
  const id = String(params.id)
  const { show } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const schema = z.object({
    title: z.string().min(4, 'Informe um título com pelo menos 4 caracteres.'),
    subtitle: z.string().optional(),
    author_name: z.string().min(2, 'Informe o autor.'),
    slug: z
      .string()
      .transform((v) => v ?? '')
      .refine((v) => v === '' || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v), 'Slug inválido. Use letras minúsculas, números e hífens.'),
  })
  type FormData = z.infer<typeof schema>
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { title: '', subtitle: '', slug: '', author_name: 'Equipe Neves & Costa' } })
  const title = watch('title')
  const subtitle = watch('subtitle')
  const slug = watch('slug')
  const authorName = watch('author_name')
  const [coverUrl, setCoverUrl] = useState('')
  const [content, setContent] = useState<string | undefined>('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [{ data: post }, { data: cats }, { data: selected }] = await Promise.all([
        supabase.from('posts').select('*').eq('id', id).single(),
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('post_categories').select('category_id').eq('post_id', id)
      ])
      if (post) {
        setValue('title', post.title || '')
        setValue('subtitle', post.subtitle || '')
        setValue('slug', post.slug || '')
        setValue('author_name', post.author_name || 'Equipe Neves & Costa')
        setCoverUrl(post.cover_url || '')
        setContent(post.content_md || '')
        setStatus(post.status || 'draft')
      }
      setCategories(cats || [])
      setSelectedCats((selected || []).map((r: any) => r.category_id))
      setLoading(false)
    }
    load()
  }, [id])

  const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const uploadImage = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `${id}-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('blog').upload(filename, file, { upsert: false })
      if (error) throw error
      const { data: pub } = supabase.storage.from('blog').getPublicUrl(data.path)
      setCoverUrl(pub.publicUrl)
    } catch (err: any) {
      const msg = String(err?.message || err)
      if (msg.toLowerCase().includes('bucket') && msg.toLowerCase().includes('not')) {
        setUploadError('Bucket "blog" não encontrado. Crie o bucket público "blog" no Supabase Storage e tente novamente.')
      } else {
        setUploadError('Falha no upload: ' + msg)
      }
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: FormData, publish?: boolean) => {
    setSaving(true)
    const md = content || ''
    const html = await (await fetch('/api/markdown', { method: 'POST', body: md })).text().catch(() => '')

    const updates: any = {
      title: data.title,
      subtitle: data.subtitle,
      author_name: data.author_name,
      slug: (data.slug && data.slug.length > 0 ? data.slug : toSlug(data.title)),
      cover_url: coverUrl,
      content_md: md,
      content_html: html,
      status: publish ? 'published' : status,
      published_at: publish ? new Date().toISOString() : undefined,
    }

    if (selectedCats.length === 0) {
      setSaving(false)
      show({ title: 'Selecione ao menos 1 categoria', variant: 'error' })
      return
    }
    const { error } = await supabase.from('posts').update(updates).eq('id', id)
    if (!error) {
      // sync categories
      await supabase.from('post_categories').delete().eq('post_id', id)
      if (selectedCats.length > 0) {
        await supabase.from('post_categories').insert(selectedCats.map((cid) => ({ post_id: id, category_id: cid })))
      }
    }
    setSaving(false)
    if (error) {
      show({ title: 'Erro ao salvar', description: error.message, variant: 'error' })
    } else {
      show({ title: publish ? 'Post publicado' : 'Rascunho salvo', variant: 'success' })
      router.push('/admin/posts')
    }
  }

  const toggleCat = (cid: string) => {
    setSelectedCats((prev) => (prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]))
  }

  const fileInput = useMemo(() => (
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const f = e.target.files?.[0]
        if (f) {
          try {
            await uploadImage(f)
            alert('Imagem enviada com sucesso!')
          } catch (err: any) {
            alert('Erro no upload: ' + (err.message || ''))
          }
        }
      }}
      className="block"
    />
  ), [id])

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Editar Post</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Título</label>
          <input className="w-full border rounded-md px-3 py-2" {...register('title')} />
          {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title.message}</div>}
        </div>
        <div>
          <label className="block text-sm mb-1">Subtítulo</label>
          <input className="w-full border rounded-md px-3 py-2" {...register('subtitle')} />
        </div>
        <div>
          <label className="block text-sm mb-1">Autor</label>
          <input className="w-full border rounded-md px-3 py-2" {...register('author_name')} />
          {errors.author_name && <div className="text-red-600 text-sm mt-1">{errors.author_name.message}</div>}
        </div>
        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input className="w-full border rounded-md px-3 py-2" {...register('slug')} />
          {errors.slug && <div className="text-red-600 text-sm mt-1">{errors.slug.message}</div>}
        </div>
        <div>
          <label className="block text-sm mb-1">URL da Imagem (cover_url)</label>
          <input className="w-full border rounded-md px-3 py-2" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
          <div className="mt-2">{fileInput}</div>
          {uploading && <div className="text-sm text-gray-500 mt-1">Enviando imagem...</div>}
          {uploadError && <div className="text-sm text-red-600 mt-1">{uploadError}</div>}
          {coverUrl && <img src={coverUrl} alt="cover" className="mt-2 h-40 rounded-md object-cover" />}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Conteúdo (Markdown)</label>
        <div data-color-mode="light">
          <MDEditor value={content} onChange={setContent} height={400} previewOptions={{ className: 'prose max-w-none' }} />
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-1">Preview:</div>
          <div className="prose max-w-none" data-color-mode="light">
            <Markdown source={content || ''} />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">Categorias</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button type="button" key={c.id} onClick={() => toggleCat(c.id)} className={`px-3 py-1 rounded-full border ${selectedCats.includes(c.id) ? 'bg-primary-600 text-white' : 'bg-white'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button disabled={saving} onClick={handleSubmit((d) => onSubmit(d, false))} className="px-4 py-2 rounded-md border">{saving ? 'Salvando...' : 'Salvar Rascunho'}</button>
        <button disabled={saving} onClick={handleSubmit((d) => onSubmit(d, true))} className="px-4 py-2 rounded-md bg-primary-600 text-white">{saving ? 'Publicando...' : 'Publicar'}</button>
      </div>
    </div>
  )
}
