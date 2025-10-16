import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Use sessionStorage on the browser so session clears when the tab/window closes.
// Fallback to default storage when window is not available (SSR/build).
export const supabase = typeof window !== 'undefined'
  ? createClient(supabaseUrl || '', supabaseAnonKey || '', {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.sessionStorage,
      },
    })
  : createClient(supabaseUrl || '', supabaseAnonKey || '')
