import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { SystemMetric, SystemMetricInsert } from '@/lib/database.types'

const MOCK_METRICS: SystemMetric[] = [
  { id: 'm1', metric_name: 'total_leads_month', metric_value: 127, metric_unit: 'count', agent_name: 'Kuranosuke-01', recorded_at: '2026-04-01T09:00:00Z' },
  { id: 'm2', metric_name: 'revenue_month', metric_value: 3200000, metric_unit: 'THB', agent_name: 'Gengo-35', recorded_at: '2026-04-01T09:00:00Z' },
  { id: 'm3', metric_name: 'active_projects', metric_value: 8, metric_unit: 'count', agent_name: 'Gengo-35', recorded_at: '2026-04-01T09:00:00Z' },
  { id: 'm4', metric_name: 'conversion_rate', metric_value: 24.3, metric_unit: 'percent', agent_name: 'Jūnai-17', recorded_at: '2026-04-01T09:00:00Z' },
  { id: 'm5', metric_name: 'agents_online', metric_value: 42, metric_unit: 'count', agent_name: null, recorded_at: '2026-04-01T09:00:00Z' },
]

export async function getLatestMetric(metricName: string): Promise<SystemMetric | null> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_METRICS.find(m => m.metric_name === metricName) ?? null
  }
  const { data, error } = await supabase
    .from('system_metrics')
    .select('*')
    .eq('metric_name', metricName)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()
  if (error) return null
  return data
}

export async function getMetricHistory(metricName: string, limit = 30): Promise<SystemMetric[]> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_METRICS.filter(m => m.metric_name === metricName)
  }
  const { data, error } = await supabase
    .from('system_metrics')
    .select('*')
    .eq('metric_name', metricName)
    .order('recorded_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function recordMetric(metric: SystemMetricInsert): Promise<SystemMetric> {
  if (!isSupabaseConfigured || !supabase) {
    const defaults = { metric_unit: null, agent_name: null }
    const newItem: SystemMetric = {
      ...defaults, ...metric,
      id: String(Date.now()),
      recorded_at: new Date().toISOString(),
    }
    MOCK_METRICS.push(newItem)
    return newItem
  }
  const { data, error } = await supabase.from('system_metrics').insert(metric).select().single()
  if (error) throw error
  return data
}

export async function getDashboardKPIs(): Promise<{
  totalLeads: number
  revenueMonth: number
  activeProjects: number
  conversionRate: number
  agentsOnline: number
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      totalLeads: 127,
      revenueMonth: 3200000,
      activeProjects: 8,
      conversionRate: 24.3,
      agentsOnline: 42,
    }
  }

  // Fetch all latest KPI metrics in parallel
  const names = ['total_leads_month', 'revenue_month', 'active_projects', 'conversion_rate', 'agents_online']
  const results = await Promise.all(names.map(n => getLatestMetric(n)))
  const [leads, revenue, projects, conversion, online] = results

  return {
    totalLeads: leads?.metric_value ?? 0,
    revenueMonth: revenue?.metric_value ?? 0,
    activeProjects: projects?.metric_value ?? 0,
    conversionRate: conversion?.metric_value ?? 0,
    agentsOnline: online?.metric_value ?? 0,
  }
}
