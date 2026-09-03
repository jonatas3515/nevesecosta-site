'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Home, LogOut } from 'lucide-react'

export function AdminSidebar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdminStatus()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 AdminSidebar: Auth state changed', event, !!session?.user)
        if (event === 'SIGNED_OUT' || !session?.user) {
          setIsAdmin(false)
        } else {
          checkAdminStatus()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      setIsAdmin(profile?.role === 'admin')
    } catch (error) {
      console.error('Erro ao verificar status admin:', error)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' })
    } catch (e) {
      console.error('Erro ao fazer logout:', e)
    } finally {
      router.push('/admin/login')
    }
  }

  const handleGoToAdmin = () => {
    router.push('/admin/dashboard')
  }

  if (isLoading || !isAdmin) {
    return null
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3">
      <button
        type="button"
        onClick={handleGoToAdmin}
        className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Ir para Administração"
        title="Ir para Administração"
      >
        <Home size={20} />
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Sair (Logout)"
        title="Sair (Logout)"
      >
        <LogOut size={20} />
      </button>
    </div>
  )
}
