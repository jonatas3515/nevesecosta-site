'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Upload, Link2, Save, Eye, EyeOff, Loader2, Image } from 'lucide-react'

interface BannerSettings {
  id: string
  image_url: string
  link_url?: string
  is_active: boolean
}

export default function BannerConfig() {
  const [bannerSettings, setBannerSettings] = useState<BannerSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchBannerSettings()
  }, [])

  const toggleActive = async () => {
    const next = !isActive
    setIsActive(next)
    try {
      if (!bannerSettings?.id) {
        if (!imageUrl.trim()) {
          alert('Para ativar/desativar, primeiro informe a URL da imagem e salve as configurações.')
          setIsActive(!next)
          return
        }
        const { error } = await supabase
          .from('banner_settings')
          .insert({ image_url: imageUrl.trim(), link_url: linkUrl.trim() || null, is_active: next })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('banner_settings')
          .update({ is_active: next })
          .eq('id', bannerSettings.id)
        if (error) throw error
      }
      fetchBannerSettings()
    } catch (e: any) {
      setIsActive(!next)
      alert('Erro ao atualizar status do banner: ' + (e?.message || String(e)))
    }
  }

  const fetchBannerSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar configurações:', error)
        return
      }

      if (data) {
        setBannerSettings(data)
        setImageUrl(data.image_url)
        setLinkUrl(data.link_url || '')
        setIsActive(data.is_active)
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!uploadFile) return null

    try {
      setIsUploading(true)
      const ext = uploadFile.name.split('.').pop()
      const name = `banner_${Math.random().toString(36).slice(2)}_${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('banner-images')
        .upload(name, uploadFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('banner-images')
        .getPublicUrl(name)

      return publicUrl
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    if (!imageUrl.trim()) {
      alert('Por favor, informe a URL da imagem')
      return
    }

    try {
      setIsSaving(true)

      let finalImageUrl = imageUrl

      // Se houver arquivo para upload, faz o upload primeiro
      if (uploadFile) {
        const uploadedUrl = await handleFileUpload()
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl
        } else {
          return
        }
      }

      const settingsData = {
        image_url: finalImageUrl,
        link_url: linkUrl.trim() || null,
        is_active: isActive
      }

      if (bannerSettings) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('banner_settings')
          .update(settingsData)
          .eq('id', bannerSettings.id)

        if (error) throw error
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from('banner_settings')
          .insert(settingsData)

        if (error) throw error
      }

      alert('Configurações salvas com sucesso!')
      fetchBannerSettings()
      setUploadFile(null)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida')
        return
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB')
        return
      }

      setUploadFile(file)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-yellow-500" size={40} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Configurações do Banner do Assistente
        </h1>

        <div className="space-y-6">
          {/* Status do Banner */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {isActive ? (
                <Eye className="text-green-600" size={24} />
              ) : (
                <EyeOff className="text-gray-400" size={24} />
              )}
              <span className="font-medium">
                Banner {isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <button
              onClick={toggleActive}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isActive ? 'Desativar' : 'Ativar'}
            </button>
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload size={16} className="inline mr-2" />
              Upload de Imagem (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
            {uploadFile && (
              <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Arquivo selecionado: {uploadFile.name}
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Formatos: JPG, PNG, GIF. Tamanho máximo: 5MB. Dimensão recomendada: 300x600px.
            </p>
          </div>

          {/* URL da Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image size={16} className="inline mr-2" />
              URL da Imagem
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL da imagem que será exibida no banner. Se fizer upload, este campo será substituído.
            </p>
          </div>

          {/* URL do Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link2 size={16} className="inline mr-2" />
              URL do Link (opcional)
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://exemplo.com/destino"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL para onde o usuário será redirecionado ao clicar no banner.
            </p>
          </div>

          {/* Preview */}
          {imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview do Banner
              </label>
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <img
                  src={imageUrl}
                  alt="Preview do banner"
                  className="w-60 max-h-80 object-contain mx-auto rounded-lg shadow-md bg-white"
                  style={{
                    maxHeight: '320px',
                    width: 'auto',
                    maxWidth: '240px'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/240x320/FFD700/000000?text=Erro+ao+carregar'
                  }}
                />
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => {
                setImageUrl(bannerSettings?.image_url || '')
                setLinkUrl(bannerSettings?.link_url || '')
                setIsActive(bannerSettings?.is_active ?? true)
                setUploadFile(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center space-x-2"
            >
              {(isSaving || isUploading) ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>Salvar Configurações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
