'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminLogin() {
  const [login, setLogin] = useState('') // pode ser email/username/cpf/telefone
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let email = ''
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(login)) {
        email = login
        console.log('[LOGIN] Email detectado:', email)
      } else {
        // tentar resolver via profiles por username/cpf/phone
        console.log('[LOGIN] Buscando usuário por username/cpf/phone:', login)
        
        // Tentar por username primeiro
        let { data: row, error: searchError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', login)
          .maybeSingle()
        
        // Se não encontrou, tentar por CPF
        if (!row && !searchError) {
          const result = await supabase
            .from('profiles')
            .select('email')
            .eq('cpf', login)
            .maybeSingle()
          row = result.data
          searchError = result.error
        }
        
        // Se não encontrou, tentar por phone
        if (!row && !searchError) {
          const result = await supabase
            .from('profiles')
            .select('email')
            .eq('phone', login)
            .maybeSingle()
          row = result.data
          searchError = result.error
        }
        
        console.log('[LOGIN] Resultado da busca:', { row, searchError, email: row?.email })
        
        // Verificar se encontrou o usuário
        if (row && row.email) {
          email = row.email
        } else {
          console.error('[LOGIN] Usuário não encontrado. Row:', row)
        }
      }
      
      if (!email) {
        throw new Error('Usuário "' + login + '" não encontrado. Verifique se o login está correto.')
      }
      if (password.length < 7) throw new Error('A senha deve ter pelo menos 7 caracteres')
      
      console.log('[LOGIN] Tentando login com email:', email)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('[LOGIN] Erro no login:', error)
        throw error
      }
      console.log('[LOGIN] Login bem-sucedido!')
      window.location.href = '/admin/dashboard'
      return
    } catch (err: any) {
      console.error('[LOGIN] Erro:', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-700 border border-gold-500/30 rounded-xl p-8 text-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gold-500 text-center">Login Administrativo</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Email</label>
            <input 
              className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:border-gold-500 focus:outline-none" 
              placeholder="email, usuário, CPF ou telefone" 
              value={login} 
              onChange={(e) => setLogin(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-gray-300">Senha</label>
            <div className="relative">
              <input 
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-md px-3 py-2 pr-10 focus:border-gold-500 focus:outline-none" 
                type={showPwd ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={7} 
              />
              <button 
                type="button" 
                onClick={() => setShowPwd(v => !v)} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-200"
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1">Mínimo 7 caracteres</div>
          </div>
          {error && <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded px-3 py-2">{error}</div>}
          <button 
            disabled={loading} 
            className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
              loading 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-gold-500 hover:bg-gold-600 text-gray-900'
            }`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
