import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'

export async function getSiteContentServer<T = any>(key: string): Promise<T | null> {
  noStore()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) return null

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('key', key)
    .maybeSingle()

  if (error) return null
  return (data as any)?.data ?? null
}
