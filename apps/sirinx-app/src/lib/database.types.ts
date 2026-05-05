// Auto-mapped from database/schema.sql
// Updated manually — re-generate when schema changes

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
export type InstallationStatus = 'planned' | 'in_progress' | 'completed' | 'monitoring'
export type AgentTaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'ended'
export type SeoPageStatus = 'draft' | 'published' | 'archived'
export type CustomerPlan = 'free' | 'pro' | 'enterprise'
export type AgentLayer = 'perception' | 'analysis' | 'decision' | 'coordination' | 'rd'

export interface Lead {
  id: string
  name: string
  company: string | null
  phone: string | null
  email: string | null
  province: string | null
  source: string | null
  status: LeadStatus
  assigned_agent: string | null
  score: number
  notes: string | null
  created_at: string
  updated_at: string
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type LeadUpdate = Partial<LeadInsert>

export interface Customer {
  id: string
  lead_id: string | null
  name: string
  company: string | null
  phone: string | null
  email: string | null
  province: string | null
  plan: CustomerPlan | null
  mrr: number
  installation_date: string | null
  system_size_kw: number | null
  status: string
  created_at: string
}

export type CustomerInsert = Omit<Customer, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type CustomerUpdate = Partial<CustomerInsert>

export interface Installation {
  id: string
  customer_id: string | null
  province: string
  system_size_kw: number
  panel_count: number | null
  inverter_type: string | null
  battery_kwh: number | null
  total_cost: number | null
  monthly_savings: number | null
  roi_years: number | null
  npv: number | null
  irr: number | null
  status: InstallationStatus
  contractor_id: string | null
  completed_at: string | null
  created_at: string
}

export type InstallationInsert = Omit<Installation, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type InstallationUpdate = Partial<InstallationInsert>

export interface Contractor {
  id: string
  name: string
  company: string | null
  phone: string | null
  email: string | null
  provinces: string[] | null
  rating: number
  jobs_completed: number
  status: string
  created_at: string
}

export type ContractorInsert = Omit<Contractor, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type ContractorUpdate = Partial<ContractorInsert>

export interface SeoPage {
  id: string
  province: string
  province_th: string
  slug: string
  title: string | null
  meta_description: string | null
  content: Record<string, unknown> | null
  keywords: string[] | null
  status: SeoPageStatus
  views: number
  leads_generated: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export type SeoPageInsert = Omit<SeoPage, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export interface AgentTask {
  id: string
  agent_name: string
  agent_layer: AgentLayer | null
  task_type: string | null
  description: string | null
  status: AgentTaskStatus
  priority: number
  revenue_impact: number
  result: Record<string, unknown> | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}

export type AgentTaskInsert = Omit<AgentTask, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type AgentTaskUpdate = Partial<AgentTaskInsert>

export interface Campaign {
  id: string
  name: string
  type: string | null
  budget: number | null
  spent: number
  leads_generated: number
  conversions: number
  roi: number | null
  status: CampaignStatus
  started_at: string | null
  ended_at: string | null
  created_at: string
}

export type CampaignInsert = Omit<Campaign, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type CampaignUpdate = Partial<CampaignInsert>

export interface SystemMetric {
  id: string
  metric_name: string
  metric_value: number
  metric_unit: string | null
  agent_name: string | null
  recorded_at: string
}

export type SystemMetricInsert = Omit<SystemMetric, 'id' | 'recorded_at'> & {
  id?: string
  recorded_at?: string
}

// Supabase Database shape for typed client
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead
        Insert: LeadInsert
        Update: LeadUpdate
        Relationships: []
      }
      customers: {
        Row: Customer
        Insert: CustomerInsert
        Update: CustomerUpdate
        Relationships: []
      }
      installations: {
        Row: Installation
        Insert: InstallationInsert
        Update: InstallationUpdate
        Relationships: []
      }
      contractors: {
        Row: Contractor
        Insert: ContractorInsert
        Update: ContractorUpdate
        Relationships: []
      }
      seo_pages: {
        Row: SeoPage
        Insert: SeoPageInsert
        Update: Partial<SeoPageInsert>
        Relationships: []
      }
      agent_tasks: {
        Row: AgentTask
        Insert: AgentTaskInsert
        Update: AgentTaskUpdate
        Relationships: []
      }
      campaigns: {
        Row: Campaign
        Insert: CampaignInsert
        Update: CampaignUpdate
        Relationships: []
      }
      system_metrics: {
        Row: SystemMetric
        Insert: SystemMetricInsert
        Update: Partial<SystemMetricInsert>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
