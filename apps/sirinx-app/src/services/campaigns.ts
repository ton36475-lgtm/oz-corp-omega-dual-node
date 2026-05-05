import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Campaign, CampaignInsert, CampaignUpdate, CampaignStatus } from '@/lib/database.types'

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'camp1', name: 'Facebook โรงงาน Q2/2026', type: 'facebook', budget: 50000, spent: 32000, leads_generated: 28, conversions: 3, roi: 4.2, status: 'active', started_at: '2026-04-01T00:00:00Z', ended_at: null, created_at: '2026-03-25T00:00:00Z' },
  { id: 'camp2', name: 'Google Ads Solar EPC', type: 'google', budget: 80000, spent: 80000, leads_generated: 45, conversions: 6, roi: 6.8, status: 'ended', started_at: '2026-01-01T00:00:00Z', ended_at: '2026-03-31T00:00:00Z', created_at: '2025-12-20T00:00:00Z' },
  { id: 'camp3', name: 'Line OA ธุรกิจโรงแรม', type: 'line', budget: 30000, spent: 8000, leads_generated: 9, conversions: 1, roi: 2.1, status: 'active', started_at: '2026-04-01T00:00:00Z', ended_at: null, created_at: '2026-03-28T00:00:00Z' },
]

export async function getCampaigns(status?: CampaignStatus): Promise<Campaign[]> {
  if (!isSupabaseConfigured || !supabase) {
    return status ? MOCK_CAMPAIGNS.filter(c => c.status === status) : [...MOCK_CAMPAIGNS]
  }
  let query = supabase.from('campaigns').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  if (!isSupabaseConfigured || !supabase) return MOCK_CAMPAIGNS.find(c => c.id === id) ?? null

  const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createCampaign(campaign: CampaignInsert): Promise<Campaign> {
  if (!isSupabaseConfigured || !supabase) {
    const defaults = {
      spent: 0, leads_generated: 0, conversions: 0, status: 'draft' as const,
      type: null, budget: null, roi: null, started_at: null, ended_at: null,
    }
    const newItem: Campaign = {
      ...defaults, ...campaign,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    }
    MOCK_CAMPAIGNS.unshift(newItem)
    return newItem
  }
  const { data, error } = await supabase.from('campaigns').insert(campaign).select().single()
  if (error) throw error
  return data
}

export async function updateCampaign(id: string, updates: CampaignUpdate): Promise<Campaign> {
  if (!isSupabaseConfigured || !supabase) {
    const idx = MOCK_CAMPAIGNS.findIndex(c => c.id === id)
    if (idx === -1) throw new Error('Campaign not found')
    MOCK_CAMPAIGNS[idx] = { ...MOCK_CAMPAIGNS[idx], ...updates }
    return MOCK_CAMPAIGNS[idx]
  }
  const { data, error } = await supabase.from('campaigns').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function getCampaignSummary(): Promise<{ totalBudget: number; totalSpent: number; totalLeads: number; avgROI: number }> {
  const campaigns = await getCampaigns()
  const active = campaigns.filter(c => c.status === 'active' || c.status === 'ended')
  return {
    totalBudget: active.reduce((s, c) => s + (c.budget ?? 0), 0),
    totalSpent: active.reduce((s, c) => s + c.spent, 0),
    totalLeads: active.reduce((s, c) => s + c.leads_generated, 0),
    avgROI: active.length ? active.reduce((s, c) => s + (c.roi ?? 0), 0) / active.length : 0,
  }
}
