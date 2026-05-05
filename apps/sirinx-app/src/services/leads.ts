import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Lead, LeadInsert, LeadUpdate, LeadStatus } from '@/lib/database.types'

// ── Mock fallback data ──────────────────────────────────────────────────────
const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'คุณสมชาย ใจดี', company: 'บริษัท ไทยเหล็กสยาม จำกัด', phone: '081-234-5678', email: null, province: 'ชลบุรี', source: 'Facebook', status: 'new', assigned_agent: 'Kuranosuke-01', score: 80, notes: null, created_at: '2026-04-01T00:00:00Z', updated_at: '2026-04-01T00:00:00Z' },
  { id: '2', name: 'คุณสุภาพร รักไทย', company: 'โรงแรม Grand Royal Bangkok', phone: '082-345-6789', email: null, province: 'กรุงเทพ', source: 'Line OA', status: 'proposal', assigned_agent: 'Kihei-26', score: 90, notes: null, created_at: '2026-03-28T00:00:00Z', updated_at: '2026-03-28T00:00:00Z' },
  { id: '3', name: 'คุณประยุทธ์ มั่นคง', company: 'นิคมอุตสาหกรรม ABC', phone: '083-456-7890', email: null, province: 'ระยอง', source: 'Google Ads', status: 'won', assigned_agent: 'Gengo-35', score: 95, notes: null, created_at: '2026-03-20T00:00:00Z', updated_at: '2026-03-20T00:00:00Z' },
  { id: '4', name: 'คุณวิมล สุขใส', company: 'โรงงานน้ำตาลไทย', phone: '084-567-8901', email: null, province: 'ขอนแก่น', source: 'Referral', status: 'qualified', assigned_agent: 'Jūnai-17', score: 85, notes: null, created_at: '2026-03-25T00:00:00Z', updated_at: '2026-03-25T00:00:00Z' },
  { id: '5', name: 'คุณอัมพร ดีงาม', company: 'ห้างสรรพสินค้า Future Park', phone: '085-678-9012', email: null, province: 'ปทุมธานี', source: 'Facebook', status: 'contacted', assigned_agent: 'Kuranosuke-01', score: 70, notes: null, created_at: '2026-03-30T00:00:00Z', updated_at: '2026-03-30T00:00:00Z' },
]

// ── Service functions ───────────────────────────────────────────────────────

export async function getLeads(options?: {
  status?: LeadStatus
  province?: string
  limit?: number
  offset?: number
}): Promise<Lead[]> {
  if (!isSupabaseConfigured || !supabase) {
    const { status, province } = options ?? {}
    return MOCK_LEADS.filter(l =>
      (!status || l.status === status) &&
      (!province || l.province === province)
    )
  }

  let query = supabase.from('leads').select('*').order('created_at', { ascending: false })

  if (options?.status) query = query.eq('status', options.status)
  if (options?.province) query = query.eq('province', options.province)
  if (options?.limit) query = query.limit(options.limit)
  if (options?.offset) query = query.range(options.offset, (options.offset ?? 0) + (options.limit ?? 50) - 1)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getLeadById(id: string): Promise<Lead | null> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_LEADS.find(l => l.id === id) ?? null
  }
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createLead(lead: LeadInsert): Promise<Lead> {
  if (!isSupabaseConfigured || !supabase) {
    const defaults = {
      score: 0, status: 'new' as LeadStatus,
      company: null, phone: null, email: null, province: null,
      source: null, assigned_agent: null, notes: null,
    }
    const newLead: Lead = {
      ...defaults, ...lead,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    MOCK_LEADS.unshift(newLead)
    return newLead
  }
  const { data, error } = await supabase.from('leads').insert(lead).select().single()
  if (error) throw error
  return data
}

export async function updateLead(id: string, updates: LeadUpdate): Promise<Lead> {
  if (!isSupabaseConfigured || !supabase) {
    const idx = MOCK_LEADS.findIndex(l => l.id === id)
    if (idx === -1) throw new Error('Lead not found')
    MOCK_LEADS[idx] = { ...MOCK_LEADS[idx], ...updates, updated_at: new Date().toISOString() }
    return MOCK_LEADS[idx]
  }
  const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteLead(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const idx = MOCK_LEADS.findIndex(l => l.id === id)
    if (idx !== -1) MOCK_LEADS.splice(idx, 1)
    return
  }
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}

export async function getLeadsCount(): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return MOCK_LEADS.length
  const { count, error } = await supabase.from('leads').select('id', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

export async function getLeadsByStatus(): Promise<Record<LeadStatus, number>> {
  const leads = await getLeads()
  const result: Record<LeadStatus, number> = { new: 0, contacted: 0, qualified: 0, proposal: 0, won: 0, lost: 0 }
  for (const lead of leads) {
    result[lead.status] = (result[lead.status] ?? 0) + 1
  }
  return result
}
