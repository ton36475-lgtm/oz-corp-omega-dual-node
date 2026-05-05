import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Contractor, ContractorInsert, ContractorUpdate } from '@/lib/database.types'

const MOCK_CONTRACTORS: Contractor[] = [
  { id: 'con1', name: 'คุณวิโรจน์ ช่างเก่ง', company: 'Solar Tech Thailand', phone: '081-111-2222', email: 'viroat@solartech.th', provinces: ['ชลบุรี', 'ระยอง', 'ฉะเชิงเทรา'], rating: 4.8, jobs_completed: 42, status: 'active', created_at: '2025-01-01T00:00:00Z' },
  { id: 'con2', name: 'คุณอรรถ รับงาน', company: 'EPC Solar Central', phone: '082-222-3333', email: 'art@epcsolar.th', provinces: ['กรุงเทพ', 'นนทบุรี', 'ปทุมธานี'], rating: 4.6, jobs_completed: 28, status: 'active', created_at: '2025-03-01T00:00:00Z' },
  { id: 'con3', name: 'คุณมานพ ติดตั้งดี', company: 'North Solar Installation', phone: '083-333-4444', email: 'manop@northsolar.th', provinces: ['เชียงใหม่', 'เชียงราย', 'ลำปาง'], rating: 4.5, jobs_completed: 19, status: 'active', created_at: '2025-06-01T00:00:00Z' },
]

export async function getContractors(province?: string): Promise<Contractor[]> {
  if (!isSupabaseConfigured || !supabase) {
    if (province) return MOCK_CONTRACTORS.filter(c => c.provinces?.includes(province))
    return [...MOCK_CONTRACTORS]
  }
  let query = supabase.from('contractors').select('*').eq('status', 'active').order('rating', { ascending: false })
  if (province) query = query.contains('provinces', [province])
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getContractorById(id: string): Promise<Contractor | null> {
  if (!isSupabaseConfigured || !supabase) return MOCK_CONTRACTORS.find(c => c.id === id) ?? null

  const { data, error } = await supabase.from('contractors').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createContractor(contractor: ContractorInsert): Promise<Contractor> {
  if (!isSupabaseConfigured || !supabase) {
    const defaults = {
      rating: 0, jobs_completed: 0, status: 'active',
      company: null, phone: null, email: null, provinces: null,
    }
    const newItem: Contractor = {
      ...defaults, ...contractor,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    }
    MOCK_CONTRACTORS.push(newItem)
    return newItem
  }
  const { data, error } = await supabase.from('contractors').insert(contractor).select().single()
  if (error) throw error
  return data
}

export async function updateContractor(id: string, updates: ContractorUpdate): Promise<Contractor> {
  if (!isSupabaseConfigured || !supabase) {
    const idx = MOCK_CONTRACTORS.findIndex(c => c.id === id)
    if (idx === -1) throw new Error('Contractor not found')
    MOCK_CONTRACTORS[idx] = { ...MOCK_CONTRACTORS[idx], ...updates }
    return MOCK_CONTRACTORS[idx]
  }
  const { data, error } = await supabase.from('contractors').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}
