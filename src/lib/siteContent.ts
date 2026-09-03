import { supabase } from '@/lib/supabaseClient'

export type SiteContentRow = {
  key: string
  data: any
  created_at?: string
  updated_at?: string
}

export async function getSiteContent<T = any>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('key', key)
    .maybeSingle()

  if (error) return null
  return (data as any)?.data ?? null
}

export async function upsertSiteContent(key: string, data: any): Promise<void> {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, data }, { onConflict: 'key' })

  if (error) throw error
}

export async function listSiteContentKeys(): Promise<string[]> {
  const { data, error } = await supabase
    .from('site_content')
    .select('key')
    .order('key')

  if (error) return []
  return (data || []).map((r: any) => r.key)
}
