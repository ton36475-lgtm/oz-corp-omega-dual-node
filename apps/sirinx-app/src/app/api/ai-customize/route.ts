// POST /api/ai-customize — send natural language command to local AI model
// Returns office state instructions (which agents to activate, what status)

import { NextRequest, NextResponse } from 'next/server'

const MODEL_URLS: Record<string, string> = {
  openclaw:  'http://127.0.0.1:11434',
  hiclaw:    'http://127.0.0.1:11435',
  ollama:    'http://127.0.0.1:11434',
  lmstudio:  'http://127.0.0.1:1234',
}

const SYSTEM_PROMPT = `You are the AI controller for the SIRINX 47 Ronin office animation system.
The office has 48 pixel art characters (AI agents) organized in layers: L1 (Perception), L2 (Analysis), L3 (Decision), L4 (Coordination), L5 (R&D), and Kai (Chatbot).
When given a natural language command, respond with a JSON object specifying status for agents.
Each agent has an id like "agent-01-pv-monitor", "chatbot-kai", etc.
Possible statuses: "working", "analyzing", "waiting", "idle", "error", "success", "offline".
Respond ONLY with valid JSON in this format:
{ "overrides": { "agent-id": "status", ... }, "message": "brief explanation in Thai" }
Be smart about interpreting commands in Thai or English.`

export async function POST(req: NextRequest) {
  const { model, prompt } = await req.json() as { model: string; prompt: string }

  const baseUrl = MODEL_URLS[model]
  if (!baseUrl) {
    return NextResponse.json({ error: 'Unknown model' }, { status: 400 })
  }

  try {
    // Try Ollama-compatible API first
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 10000)

    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'llama3',   // default — overridden by whatever is loaded
        prompt: `${SYSTEM_PROMPT}\n\nUser command: ${prompt}`,
        stream: false,
        format: 'json',
      }),
    })

    if (!res.ok) throw new Error(`Model API error: ${res.status}`)
    const data = await res.json() as { response: string }
    const parsed = JSON.parse(data.response) as { overrides: Record<string, string>; message: string }
    return NextResponse.json(parsed)
  } catch {
    // Fallback: parse locally using keyword matching (always works, no model needed)
    const fallback = localFallback(prompt)
    return NextResponse.json(fallback)
  }
}

function localFallback(prompt: string): { overrides: Record<string, string>; message: string } {
  const lower = prompt.toLowerCase()
  const overrides: Record<string, string> = {}

  // Layer-based commands
  const setLayer = (ids: string[], status: string) => ids.forEach(id => { overrides[id] = status })

  const L1 = ['agent-01-pv-monitor','agent-02-battery-monitor','agent-03-weather','agent-04-grid-tariff','agent-05-site-survey','agent-06-customer-usage','agent-07-maintenance-hist','agent-08-contractor-perf','agent-09-fb-group-scanner','agent-10-fb-comment-scanner','agent-11-tiktok-scanner','agent-12-instagram-scanner','agent-13-youtube-scanner','agent-14-property-scanner','agent-15-google-maps','agent-16-multi-bot-coord']
  const L2 = ['agent-17-degradation','agent-18-financial-analysis','agent-19-tax-optimization','agent-20-production-forecast','agent-21-battery-optimizer','agent-22-low-prod-detection','agent-23-cash-flow-health','agent-24-lead-qualification','agent-25-competitor-intel']
  const L3 = ['agent-26-proposal-gen','agent-27-service-recommend','agent-28-job-posting','agent-29-bid-evaluation','agent-30-promotion-engine','agent-31-notification','agent-32-verification','agent-33-content-request','agent-34-email-marketing','agent-43-security']
  const L4 = ['agent-35-orchestrator','agent-36-customer-portal','agent-37-core-dashboard','agent-38-contractor-portal','agent-39-growth-acq','agent-40-decision-router','agent-41-state-manager','agent-42-learning-optim']
  const L5 = ['agent-44-ai-trend-scanner','agent-45-code-evolution','agent-46-benchmark-research','agent-47-integration-disc']
  const ALL = [...L1, ...L2, ...L3, ...L4, ...L5, 'chatbot-kai']

  if (lower.includes('ทุก') && (lower.includes('ทำงาน') || lower.includes('full'))) {
    setLayer(ALL, 'working')
    return { overrides, message: 'ทุก agent เริ่มทำงานพร้อมกัน 🔥' }
  }
  if (lower.includes('พัก') || lower.includes('หยุด') || lower.includes('idle')) {
    setLayer(ALL, 'idle')
    return { overrides, message: 'ทุก agent หยุดพัก 😴' }
  }
  if (lower.includes('l1') || lower.includes('perception')) {
    setLayer(L1, lower.includes('error') ? 'error' : 'working')
    return { overrides, message: 'L1 Perception กำลังสแกนข้อมูล 📡' }
  }
  if (lower.includes('l2') || lower.includes('วิเคราะห์') || lower.includes('analy')) {
    setLayer(L2, 'analyzing')
    return { overrides, message: 'L2 Analysis กำลังวิเคราะห์ข้อมูล 🔬' }
  }
  if (lower.includes('l3') || lower.includes('decision')) {
    setLayer(L3, lower.includes('error') ? 'error' : 'working')
    return { overrides, message: 'L3 Decision กำลังตัดสินใจ ⚖️' }
  }
  if (lower.includes('l4') || lower.includes('orchestrat') || lower.includes('coord')) {
    setLayer(L4, 'working')
    return { overrides, message: 'L4 Coordination กำลังจัดการ pipeline 🎯' }
  }
  if (lower.includes('l5') || lower.includes('research') || lower.includes('rd') || lower.includes('r&d')) {
    setLayer(L5, 'analyzing')
    return { overrides, message: 'L5 R&D Bunker กำลังวิจัย 🔭' }
  }
  if (lower.includes('kai')) {
    setLayer(ALL.filter(id => id !== 'chatbot-kai'), 'idle')
    overrides['chatbot-kai'] = 'working'
    return { overrides, message: 'Kai กำลังคุยกับลูกค้า 💬' }
  }
  if (lower.includes('gengo') || lower.includes('orchestrator')) {
    overrides['agent-35-orchestrator'] = 'working'
    setLayer(L4.filter(id => id !== 'agent-35-orchestrator'), 'waiting')
    return { overrides, message: 'Gengo (Master Orchestrator) กำลังทำงานหนัก ⚔️' }
  }
  if (lower.includes('error')) {
    setLayer(L3, 'error')
    return { overrides, message: 'L3 Decision เกิด error 🚨' }
  }
  if (lower.includes('success')) {
    setLayer(ALL, 'success')
    return { overrides, message: 'Mission complete! ✅' }
  }

  return { overrides: {}, message: `ไม่เข้าใจคำสั่ง "${prompt}" — ลองใช้ preset หรือพิมพ์ชื่อ layer` }
}
