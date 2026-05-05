import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Installation, InstallationInsert, InstallationUpdate, InstallationStatus } from '@/lib/database.types'

const MOCK_INSTALLATIONS: Installation[] = [
  { id: 'i1', customer_id: 'c1', province: 'ระยอง', system_size_kw: 500, panel_count: 1000, inverter_type: 'Huawei SUN2000', battery_kwh: null, total_cost: 15000000, monthly_savings: 180000, roi_years: 6.9, npv: 8500000, irr: 18.5, status: 'completed', contractor_id: null, completed_at: '2026-02-28T00:00:00Z', created_at: '2026-01-10T00:00:00Z' },
  { id: 'i2', customer_id: 'c2', province: 'นครปฐม', system_size_kw: 400, panel_count: 800, inverter_type: 'Sungrow SG250HX', battery_kwh: null, total_cost: 12000000, monthly_savings: 144000, roi_years: 6.9, npv: 6800000, irr: 17.2, status: 'monitoring', contractor_id: null, completed_at: '2026-01-31T00:00:00Z', created_at: '2025-12-01T00:00:00Z' },
]

export async function getInstallations(status?: InstallationStatus): Promise<Installation[]> {
  if (!isSupabaseConfigured || !supabase) {
    return status ? MOCK_INSTALLATIONS.filter(i => i.status === status) : [...MOCK_INSTALLATIONS]
  }
  let query = supabase.from('installations').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getInstallationById(id: string): Promise<Installation | null> {
  if (!isSupabaseConfigured || !supabase) return MOCK_INSTALLATIONS.find(i => i.id === id) ?? null

  const { data, error } = await supabase.from('installations').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createInstallation(installation: InstallationInsert): Promise<Installation> {
  if (!isSupabaseConfigured || !supabase) {
    const defaults = {
      status: 'planned' as const,
      customer_id: null, panel_count: null, inverter_type: null, battery_kwh: null,
      total_cost: null, monthly_savings: null, roi_years: null, npv: null, irr: null,
      contractor_id: null, completed_at: null,
    }
    const newItem: Installation = {
      ...defaults, ...installation,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    }
    MOCK_INSTALLATIONS.unshift(newItem)
    return newItem
  }
  const { data, error } = await supabase.from('installations').insert(installation).select().single()
  if (error) throw error
  return data
}

export async function updateInstallation(id: string, updates: InstallationUpdate): Promise<Installation> {
  if (!isSupabaseConfigured || !supabase) {
    const idx = MOCK_INSTALLATIONS.findIndex(i => i.id === id)
    if (idx === -1) throw new Error('Installation not found')
    MOCK_INSTALLATIONS[idx] = { ...MOCK_INSTALLATIONS[idx], ...updates }
    return MOCK_INSTALLATIONS[idx]
  }
  const { data, error } = await supabase.from('installations').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function getInstallationsByProvince(): Promise<Record<string, number>> {
  const installs = await getInstallations()
  return installs.reduce<Record<string, number>>((acc, i) => {
    acc[i.province] = (acc[i.province] ?? 0) + 1
    return acc
  }, {})
}
