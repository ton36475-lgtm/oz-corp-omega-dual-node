import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Customer, CustomerInsert, CustomerUpdate } from '@/lib/database.types'

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', lead_id: '3', name: 'คุณประยุทธ์ มั่นคง', company: 'นิคมอุตสาหกรรม ABC', phone: '083-456-7890', email: 'abc@example.com', province: 'ระยอง', plan: 'enterprise', mrr: 45000, installation_date: '2026-02-15', system_size_kw: 500, status: 'active', created_at: '2026-02-15T00:00:00Z' },
  { id: 'c2', lead_id: '8', name: 'คุณเกียรติศักดิ์ วงษ์', company: 'โรงงานฟาร์มา Plus', phone: '088-901-2345', email: 'pharma@example.com', province: 'นครปฐม', plan: 'pro', mrr: 28000, installation_date: '2026-01-20', system_size_kw: 400, status: 'active', created_at: '2026-01-20T00:00:00Z' },
]

export async function getCustomers(): Promise<Customer[]> {
  if (!isSupabaseConfigured || !supabase) return [...MOCK_CUSTOMERS]

  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (!isSupabaseConfigured || !supabase) return MOCK_CUSTOMERS.find(c => c.id === id) ?? null

  const { data, error } = await supabase.from('customers').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createCustomer(customer: CustomerInsert): Promise<Customer> {
  if (!isSupabaseConfigured || !supabase) {
    const defaults = {
      mrr: 0, status: 'active',
      lead_id: null, company: null, phone: null, email: null,
      province: null, plan: null, installation_date: null, system_size_kw: null,
    }
    const newCustomer: Customer = {
      ...defaults, ...customer,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    }
    MOCK_CUSTOMERS.unshift(newCustomer)
    return newCustomer
  }
  const { data, error } = await supabase.from('customers').insert(customer).select().single()
  if (error) throw error
  return data
}

export async function updateCustomer(id: string, updates: CustomerUpdate): Promise<Customer> {
  if (!isSupabaseConfigured || !supabase) {
    const idx = MOCK_CUSTOMERS.findIndex(c => c.id === id)
    if (idx === -1) throw new Error('Customer not found')
    MOCK_CUSTOMERS[idx] = { ...MOCK_CUSTOMERS[idx], ...updates }
    return MOCK_CUSTOMERS[idx]
  }
  const { data, error } = await supabase.from('customers').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function getTotalMRR(): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return MOCK_CUSTOMERS.reduce((s, c) => s + c.mrr, 0)

  const { data, error } = await supabase.from('customers').select('mrr').eq('status', 'active')
  if (error) throw error
  return (data ?? []).reduce((s, c) => s + (c.mrr ?? 0), 0)
}
