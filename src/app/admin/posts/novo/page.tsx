'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })
const Markdown = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false })

export default function NovoPost() {
  const { show } = useToast()
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { title: '', subtitle: '', slug: '', author_name: 'Equipe Neves & Costa' } })
  const title = watch('title')
  const subtitle = watch('subtitle')
  const slug = watch('slug')
  const [coverUrl, setCoverUrl] = useState('')
  const [content, setContent] = useState<string | undefined>('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('categories').select('id, name').order('name').then(({ data }) => setCategories(data || []))
  }, [])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty && !loading) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty, loading])

  const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const uploadImage = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `new-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('blog').upload(filename, file, { upsert: false })
      if (error) throw error
      const { data: pub } = supabase.storage.from('blog').getPublicUrl(data.path)
      setCoverUrl(pub.publicUrl)
      setDirty(true)
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

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const finalSlug = (data.slug && data.slug.length > 0 ? data.slug : toSlug(data.title))
    if (selectedCats.length === 0) {
      setLoading(false)
      show({ title: 'Selecione ao menos 1 categoria', variant: 'error' })
      return
    }
    const md = content || ''
    const html = await (await fetch('/api/markdown', { method: 'POST', body: md })).text().catch(() => '')

    const { data: post, error } = await supabase
      .from('posts')
      .insert({ title: data.title, subtitle: data.subtitle, author_name: data.author_name, slug: finalSlug, cover_url: coverUrl, content_md: md, content_html: html, status: 'draft' })
      .select('id')
      .single()

    if (!error && post?.id && selectedCats.length > 0) {
      await supabase.from('post_categories').insert(selectedCats.map((cid) => ({ post_id: post.id, category_id: cid })))
    }

    setLoading(false)
    if (error) {
      show({ title: 'Erro ao salvar', description: error.message, variant: 'error' })
    } else {
      setDirty(false)
      show({ title: 'Rascunho salvo', variant: 'success' })
      window.location.href = '/admin/posts'
    }
  }

  const toggleCat = (id: string) => {
    setSelectedCats((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Novo Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Título</label>
            <input className="w-full border rounded-md px-3 py-2" {...register('title', { onChange: () => setDirty(true) })} />
            {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title.message}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">Subtítulo</label>
            <input className="w-full border rounded-md px-3 py-2" {...register('subtitle', { onChange: () => setDirty(true) })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Autor</label>
            <input className="w-full border rounded-md px-3 py-2" {...register('author_name', { onChange: () => setDirty(true) })} />
            {errors.author_name && <div className="text-red-600 text-sm mt-1">{errors.author_name.message}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input className="w-full border rounded-md px-3 py-2" placeholder="auto do título" {...register('slug', { onChange: () => setDirty(true) })} />
            {errors.slug && <div className="text-red-600 text-sm mt-1">{errors.slug.message}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">URL da Imagem (cover_url)</label>
            <input className="w-full border rounded-md px-3 py-2" value={coverUrl} onChange={(e) => { setCoverUrl(e.target.value); setDirty(true) }} />
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (f) {
                  try {
                    await uploadImage(f)
                    show({ title: 'Imagem enviada', variant: 'success' })
                  } catch (err: any) {
                    show({ title: 'Erro no upload', description: String(err?.message || err), variant: 'error' })
                  }
                }
              }}
              className="mt-2 block"
            />
            {uploading && <div className="text-sm text-gray-500 mt-1">Enviando imagem...</div>}
            {uploadError && <div className="text-sm text-red-600 mt-1">{uploadError}</div>}
            {coverUrl && <img src={coverUrl} alt="cover" className="mt-2 h-40 rounded-md object-cover" />}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Conteúdo (Markdown)</label>
          <div data-color-mode="light">
            <MDEditor value={content} onChange={(v) => { setContent(v); setDirty(true) }} height={400} previewOptions={{ className: 'prose max-w-none' }} />
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
            {categories.length === 0 && <div className="text-gray-500 text-sm">Nenhuma categoria. Crie em /admin/categorias.</div>}
          </div>
        </div>

        <div className="flex gap-3">
          <button disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded-md">{loading ? 'Salvando...' : 'Salvar como Rascunho'}</button>
        </div>
      </form>
    </div>
  )
}
