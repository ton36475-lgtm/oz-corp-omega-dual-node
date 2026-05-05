import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { AgentTask, AgentTaskInsert, AgentTaskUpdate, AgentTaskStatus, AgentLayer } from '@/lib/database.types'

const MOCK_TASKS: AgentTask[] = [
  { id: 't1', agent_name: 'Kuranosuke-01', agent_layer: 'perception', task_type: 'scan_facebook', description: 'สแกน Facebook Group หา leads ใหม่', status: 'completed', priority: 8, revenue_impact: 50000, result: { leads_found: 14 }, started_at: '2026-04-01T06:00:00Z', completed_at: '2026-04-01T06:30:00Z', created_at: '2026-04-01T06:00:00Z' },
  { id: 't2', agent_name: 'Jūnai-17', agent_layer: 'analysis', task_type: 'score_lead', description: 'วิเคราะห์และให้คะแนน leads รอบเช้า', status: 'in_progress', priority: 9, revenue_impact: 120000, result: null, started_at: '2026-04-01T09:00:00Z', completed_at: null, created_at: '2026-04-01T09:00:00Z' },
  { id: 't3', agent_name: 'Kihei-26', agent_layer: 'decision', task_type: 'generate_proposal', description: 'สร้างใบเสนอราคา: โรงแรม Grand Royal Bangkok', status: 'completed', priority: 10, revenue_impact: 8500000, result: { proposal_id: 'P2026-042', value: 8500000 }, started_at: '2026-04-01T08:15:00Z', completed_at: '2026-04-01T08:45:00Z', created_at: '2026-04-01T08:00:00Z' },
  { id: 't4', agent_name: 'Gengo-35', agent_layer: 'coordination', task_type: 'orchestrate_pipeline', description: 'ประสานงาน pipeline closing leads สัปดาห์นี้', status: 'in_progress', priority: 10, revenue_impact: 25000000, result: null, started_at: '2026-04-01T09:00:00Z', completed_at: null, created_at: '2026-04-01T07:00:00Z' },
]

export async function getAgentTasks(options?: {
  status?: AgentTaskStatus
  agentLayer?: AgentLayer
  agentName?: string
  limit?: number
}): Promise<AgentTask[]> {
  if (!isSupabaseConfigured || !supabase) {
    let tasks = [...MOCK_TASKS]
    if (options?.status) tasks = tasks.filter(t => t.status === options.status)
    if (options?.agentLayer) tasks = tasks.filter(t => t.agent_layer === options.agentLayer)
    if (options?.agentName) tasks = tasks.filter(t => t.agent_name === options.agentName)
    return tasks.slice(0, options?.limit ?? 100)
  }

  let query = supabase.from('agent_tasks').select('*').order('created_at', { ascending: false })
  if (options?.status) query = query.eq('status', options.status)
  if (options?.agentLayer) query = query.eq('agent_layer', options.agentLayer)
  if (options?.agentName) query = query.eq('agent_name', options.agentName)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createAgentTask(task: AgentTaskInsert): Promise<AgentTask> {
  if (!isSupabaseConfigured || !supabase) {
    const defaults = {
      status: 'pending' as AgentTaskStatus, priority: 5, revenue_impact: 0,
      agent_layer: null, task_type: null, description: null, result: null,
      started_at: null, completed_at: null,
    }
    const newTask: AgentTask = {
      ...defaults, ...task,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    }
    MOCK_TASKS.unshift(newTask)
    return newTask
  }
  const { data, error } = await supabase.from('agent_tasks').insert(task).select().single()
  if (error) throw error
  return data
}

export async function updateAgentTask(id: string, updates: AgentTaskUpdate): Promise<AgentTask> {
  if (!isSupabaseConfigured || !supabase) {
    const idx = MOCK_TASKS.findIndex(t => t.id === id)
    if (idx === -1) throw new Error('Task not found')
    MOCK_TASKS[idx] = { ...MOCK_TASKS[idx], ...updates }
    return MOCK_TASKS[idx]
  }
  const { data, error } = await supabase.from('agent_tasks').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function completeAgentTask(id: string, result: Record<string, unknown>): Promise<AgentTask> {
  return updateAgentTask(id, {
    status: 'completed',
    result,
    completed_at: new Date().toISOString(),
  })
}

export async function getAgentTaskSummary(): Promise<Record<AgentTaskStatus, number>> {
  const tasks = await getAgentTasks()
  const summary: Record<AgentTaskStatus, number> = { pending: 0, in_progress: 0, completed: 0, failed: 0 }
  for (const task of tasks) {
    summary[task.status] = (summary[task.status] ?? 0) + 1
  }
  return summary
}
