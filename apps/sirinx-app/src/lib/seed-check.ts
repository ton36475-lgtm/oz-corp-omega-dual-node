import { supabase, isSupabaseConfigured } from './supabase'

export type ConnectionStatus =
  | { ok: true; tables: string[] }
  | { ok: false; reason: string }

export async function checkSupabaseConnection(): Promise<ConnectionStatus> {
  if (!isSupabaseConfigured) {
    return { ok: false, reason: 'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set' }
  }

  try {
    // Probe the leads table — lightweight count query
    const { error } = await supabase!.from('leads').select('id', { count: 'exact', head: true })
    if (error) {
      return { ok: false, reason: error.message }
    }
    return {
      ok: true,
      tables: ['leads', 'customers', 'installations', 'contractors', 'campaigns', 'agent_tasks', 'system_metrics'],
    }
  } catch (err) {
    return { ok: false, reason: String(err) }
  }
}

// Call once at app startup (server-side or from a useEffect)
export async function logConnectionStatus(): Promise<void> {
  const status = await checkSupabaseConnection()
  if (status.ok) {
    console.log('[Supabase] ✅ Connected — tables:', status.tables.join(', '))
  } else {
    console.warn('[Supabase] ⚠️  Not connected —', status.reason)
    console.warn('[Supabase] Running in MOCK DATA mode. Add keys to .env.local to connect.')
  }
}
