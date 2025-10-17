'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ToastProvider } from '@/components/ui/toast'
import { AdminNav } from './_components/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname?.startsWith('/admin/login')

  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [isStaff, setIsStaff] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('')
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (isLogin) { setReady(true); return }
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      setAuthed(!!session)
      if (session?.user?.id) {
        setUserEmail(session.user.email || '')
        try {
          const { data: prof, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          if (error) setIsStaff(true)
          else {
            setIsStaff(prof ? ['admin', 'editor'].includes((prof as any).role) : false)
            setUserRole((prof as any)?.role || '')
          }
        } catch {
          setIsStaff(true)
        }
      } else {
        setIsStaff(false)
      }
      setReady(true)
    }
    check()
  }, [isLogin])

  const handleChangePassword = async () => {
    if (newPassword.length < 7) {
      alert('A senha deve ter pelo menos 7 caracteres')
      return
    }
    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      alert('Senha alterada com sucesso!')
      setShowChangePassword(false)
      setNewPassword('')
    } catch (e: any) {
      alert('Erro ao alterar senha: ' + (e?.message || String(e)))
    } finally {
      setChangingPassword(false)
    }
  }

  if (isLogin) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 pt-28">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-md p-6">{children}</div>
          </div>
        </div>
      </ToastProvider>
    )
  }

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }
  if (!authed) {
    if (typeof window !== 'undefined') window.location.href = '/admin/login'
    return null
  }
  if (isStaff === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-xl font-semibold">Acesso restrito</p>
          <p className="text-gray-600">Sua conta não possui permissão de administrador.</p>
          <p className="text-gray-500 text-sm mt-1">Faça login com o email autorizado ou contate o administrador.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = '/admin/login' }}
              className="px-4 py-2 rounded-md bg-primary-600 text-white"
            >Trocar conta</button>
            <a href="/admin/login" className="px-4 py-2 rounded-md border">Ir para login</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-28">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gold-500">{userEmail?.toLowerCase() === 'jonatascosta.adv@gmail.com' ? 'Administrador Geral' : 'Editor'} • Neves & Costa</h1>
            {authed && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="text-sm text-gold-500 hover:text-gold-400 hover:underline"
                >
                  Mudar Senha
                </button>
                <button
                  onClick={async () => { await supabase.auth.signOut(); window.location.href = '/admin/login' }}
                  className="text-sm text-red-400 hover:text-red-300 hover:underline"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
          <AdminNav />
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gold-500/20">{children}</div>
          
          {/* Modal de mudança de senha */}
          {showChangePassword && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gold-500/30">
                <h3 className="text-xl font-bold text-gold-500 mb-4">Mudar Senha</h3>
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">Nova Senha (mínimo 7 caracteres)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-md px-3 py-2"
                    placeholder="Digite a nova senha"
                    minLength={7}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => { setShowChangePassword(false); setNewPassword('') }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                    disabled={changingPassword}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-gold-500 text-gray-900 rounded-md hover:bg-gold-600 disabled:bg-gray-600 disabled:text-gray-400 font-medium"
                    disabled={changingPassword || newPassword.length < 7}
                  >
                    {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToastProvider>
  )
}
