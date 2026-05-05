import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured =
  supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20

// Untyped client — explicit casts are done at the service layer via the types in database.types.ts
export type SupabaseDB = SupabaseClient

let _client: SupabaseDB | null = null

export function getSupabaseClient(): SupabaseDB | null {
  if (!isSupabaseConfigured) return null
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _client
}

// Named export for convenience — returns null if not configured
export const supabase: SupabaseDB | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
