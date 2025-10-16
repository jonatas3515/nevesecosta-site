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
      } else {
        // tentar resolver via profiles por username/cpf/phone
        const { data: row } = await supabase
          .from('profiles')
          .select('email')
          .or(`username.eq.${login},cpf.eq.${login},phone.eq.${login}`)
          .maybeSingle()
        email = row?.email || ''
      }
      if (!email) throw new Error('Login não encontrado')
      if (password.length < 7) throw new Error('A senha deve ter pelo menos 7 caracteres')
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      window.location.href = '/admin/dashboard'
      return
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login Administrativo</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded-md px-3 py-2" placeholder="email, usuário, CPF ou telefone" value={login} onChange={(e) => setLogin(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Senha</label>
          <div className="relative">
            <input className="w-full border rounded-md px-3 py-2 pr-10" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={7} />
            <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">{showPwd ? '🙈' : '👁️'}</button>
          </div>
          <div className="text-xs text-gray-500 mt-1">Mínimo 7 caracteres</div>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded-md w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
