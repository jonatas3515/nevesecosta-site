'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export default function AdminCategorias() {
  const { show } = useToast()
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [loading, setLoading] = useState(false)

  const schema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    slug: z
      .string()
      .min(2, 'Slug muito curto')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use minúsculas, números e hífens'),
  })

  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '', slug: '' } })

  const load = async () => {
    const { data } = await supabase.from('categories').select('id, name, slug').order('name')
    setCategories(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const createCategory = async (data: FormData) => {
    setLoading(true)
    const { error } = await supabase.from('categories').insert({ name: data.name, slug: data.slug })
    setLoading(false)
    if (error) {
      show({ title: 'Erro ao criar categoria', description: error.message, variant: 'error' })
    } else {
      reset({ name: '', slug: '' })
      show({ title: 'Categoria criada', variant: 'success' })
      await load()
    }
  }

  const removeCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      show({ title: 'Erro ao excluir', description: error.message, variant: 'error' })
    } else {
      show({ title: 'Categoria excluída', variant: 'success' })
      await load()
    }
  }

  return (
    <div className="space-y-6 text-gray-100">
      <h2 className="text-2xl font-bold text-gold-500">Categorias</h2>

      <form onSubmit={handleSubmit(createCategory)} className="grid md:grid-cols-3 gap-3 items-end bg-gray-700 border border-gold-500/30 rounded-xl p-4">
        <div>
          <label className="text-sm block mb-1 text-gray-300">Nome</label>
          <input className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" {...register('name')} />
          {errors.name && <div className="text-sm text-red-400 mt-1">{errors.name.message}</div>}
        </div>
        <div>
          <label className="text-sm block mb-1 text-gray-300">Slug</label>
          <input className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2" {...register('slug')} />
          {errors.slug && <div className="text-sm text-red-400 mt-1">{errors.slug.message}</div>}
        </div>
        <button disabled={loading} className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-600 text-white' : 'bg-gold-500 hover:bg-gold-600 text-gray-900'}`}>
          {loading ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>

      <div className="border border-gold-500/30 rounded-md overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-800 text-gray-100">
              <th className="p-3">Nome</th>
              <th className="p-3">Slug</th>
              <th className="p-3 w-32">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-gray-700">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.slug}</td>
                <td className="p-3">
                  <button onClick={() => removeCategory(c.id)} className="px-3 py-1 text-sm border border-red-600 rounded text-red-400 hover:bg-red-600 hover:text-white">Excluir</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-400">Sem categorias</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
