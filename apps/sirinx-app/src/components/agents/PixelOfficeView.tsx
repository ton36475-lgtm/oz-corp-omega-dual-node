'use client'

import { useState, useEffect, useCallback } from 'react'
import { AGENT_DNA, LAYER_COLORS, type AgentDNA } from '@/data/agent-dna-data'

// ─── Runtime Status ───────────────────────────────────────────────────────────

export type RunStatus = 'idle' | 'working' | 'analyzing' | 'waiting' | 'error' | 'success' | 'offline'

const STATUS_META: Record<RunStatus, { bubble: string; bubbleColor: string; label: string; animClass: string }> = {
  idle:      { bubble: '',    bubbleColor: '',        label: 'idle',      animClass: 'anim-idle'     },
  working:   { bubble: '⌨',  bubbleColor: '#F5A623', label: 'working',   animClass: 'anim-working'  },
  analyzing: { bubble: '📖', bubbleColor: '#A855F7', label: 'analyzing', animClass: 'anim-reading'  },
  waiting:   { bubble: '!',  bubbleColor: '#EF4444', label: 'waiting',   animClass: 'anim-waiting'  },
  error:     { bubble: '✕',  bubbleColor: '#EF4444', label: 'error',     animClass: 'anim-error'    },
  success:   { bubble: '✓',  bubbleColor: '#10B981', label: 'done',      animClass: 'anim-success'  },
  offline:   { bubble: 'z',  bubbleColor: '#64748B', label: 'offline',   animClass: 'anim-offline'  },
}

// ─── Pixel Character Sprite ───────────────────────────────────────────────────

function PixelSprite({ color, status }: { color: string; status: RunStatus }) {
  const isWorking = status === 'working'
  const isWaiting = status === 'waiting'
  const isOffline = status === 'offline'
  const bodyColor = isOffline ? '#444' : color
  const alpha = isOffline ? '60' : 'FF'

  return (
    <svg
      width="20" height="24"
      viewBox="0 0 20 24"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Hair */}
      <rect x="4" y="0" width="12" height="3" fill={bodyColor + 'CC'} />
      {/* Head */}
      <rect x="3" y="2" width="14" height="10" fill={bodyColor + alpha} />
      {/* Eyes */}
      <rect x="6"  y="5" width="3" height="3" fill="#00000066" />
      <rect x="11" y="5" width="3" height="3" fill="#00000066" />
      {/* Mouth */}
      {isWaiting
        ? <rect x="7" y="9" width="6" height="2" fill="#ff000088" />
        : <rect x="7" y="9" width="6" height="1" fill="#00000044" />
      }
      {/* Body */}
      <rect x="4" y="13" width="12" height="7" fill={bodyColor + 'CC'} />
      {/* Arms — wiggle when working */}
      <rect x="1"  y="13" width="3" height={isWorking ? '5' : '6'} fill={bodyColor + '99'} />
      <rect x="16" y="13" width="3" height={isWorking ? '5' : '6'} fill={bodyColor + '99'} />
      {/* Legs */}
      <rect x="4"  y="21" width="5" height="3" fill={bodyColor + '88'} />
      <rect x="11" y="21" width="5" height="3" fill={bodyColor + '88'} />
    </svg>
  )
}

// ─── Status Bubble ─────────────────────────────────────────────────────────────

function StatusBubble({ status }: { status: RunStatus }) {
  const meta = STATUS_META[status]
  if (!meta.bubble) return null

  return (
    <div
      className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-sm z-10 font-mono font-bold text-[10px] select-none"
      style={{
        width: 16, height: 14,
        background: meta.bubbleColor + '22',
        border: `1px solid ${meta.bubbleColor}`,
        color: meta.bubbleColor,
        animation: status === 'waiting' ? 'bubble-pulse 0.8s ease-in-out infinite' : undefined,
      }}
    >
      {meta.bubble}
    </div>
  )
}

// ─── Desk ─────────────────────────────────────────────────────────────────────

function Desk({
  dna, status, onClick,
}: {
  dna: AgentDNA
  status: RunStatus
  onClick: () => void
}) {
  const col = LAYER_COLORS[dna.layer] ?? '#94A3B8'
  const meta = STATUS_META[status]

  return (
    <button
      onClick={onClick}
      title={`${dna.codename} — ${dna.displayName}\n${dna.mission}`}
      className="relative flex flex-col items-center gap-0.5 p-1.5 rounded-none border transition-all duration-150 cursor-pointer group hover:z-20 focus:outline-none"
      style={{
        background: col + '11',
        borderColor: status !== 'idle' ? col + '60' : col + '20',
        animation: meta.animClass === 'anim-working' ? 'desk-glow 1s ease-in-out infinite alternate' : undefined,
        '--glow-color': col,
      } as React.CSSProperties}
    >
      {/* Status bubble */}
      <div className="relative w-5 h-6">
        <StatusBubble status={status} />
        {/* Character sprite with animation */}
        <div
          className="w-5 h-6"
          style={{
            animation: status === 'idle'      ? 'char-idle 2s ease-in-out infinite'
                     : status === 'working'   ? 'char-work 0.3s steps(2) infinite'
                     : status === 'analyzing' ? 'char-read 1.5s ease-in-out infinite'
                     : status === 'waiting'   ? 'char-wait 0.5s ease-in-out infinite'
                     : status === 'error'     ? 'char-shake 0.2s steps(2) infinite'
                     : status === 'success'   ? 'char-jump 0.4s ease-out 1'
                     : undefined,
          }}
        >
          <PixelSprite color={col} status={status} />
        </div>
      </div>

      {/* Desk surface */}
      <div className="w-full h-1 rounded-none" style={{ background: '#8B6914', border: '1px solid #A0522D' }} />

      {/* Codename label */}
      <div
        className="text-[8px] font-mono font-bold truncate max-w-[56px] leading-none mt-0.5"
        style={{ color: col, letterSpacing: '0.05em' }}
      >
        {dna.codename}
      </div>

      {/* Status dot */}
      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-none" style={{
        background: status === 'working'   ? '#F5A623'
                  : status === 'analyzing' ? '#A855F7'
                  : status === 'waiting'   ? '#EF4444'
                  : status === 'error'     ? '#EF4444'
                  : status === 'success'   ? '#10B981'
                  : status === 'offline'   ? '#444'
                  : col + '40',
        animation: ['working', 'waiting'].includes(status) ? 'dot-blink 1s ease-in-out infinite' : undefined,
      }} />
    </button>
  )
}

// ─── Department Room ──────────────────────────────────────────────────────────

function DepartmentRoom({
  layer, agents, statusMap, onSelectAgent,
}: {
  layer: string
  agents: AgentDNA[]
  statusMap: Record<string, RunStatus>
  onSelectAgent: (dna: AgentDNA) => void
}) {
  const col = LAYER_COLORS[layer] ?? '#94A3B8'
  const layerLabel: Record<string, string> = {
    L1: 'L1 · Perception HQ',
    L2: 'L2 · Analysis Lab',
    L3: 'L3 · Decision Chamber',
    L4: 'L4 · Coordination Hub',
    L5: 'L5 · R&D Bunker',
    Kai: 'Kai · Chatbot Room',
  }

  const activeCount = agents.filter(a => ['working', 'analyzing', 'waiting'].includes(statusMap[a.id] ?? 'idle')).length

  return (
    <div
      className="rounded-none border-2 p-3 relative"
      style={{
        background: col + '06',
        borderColor: col + '35',
      }}
    >
      {/* Room nameplate */}
      <div className="flex items-center justify-between mb-3 pb-1.5 border-b" style={{ borderColor: col + '25' }}>
        <div className="flex items-center gap-2">
          {/* Department indicator */}
          <div className="w-2 h-5 rounded-none" style={{ background: col }} />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: col }}>
            {layerLabel[layer] ?? layer}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {activeCount > 0 && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none"
              style={{ background: col + '20', color: col, border: `1px solid ${col}40` }}>
              {activeCount} active
            </span>
          )}
          <span className="text-[9px] text-white/20 font-mono">{agents.length} agents</span>
        </div>
      </div>

      {/* Checkerboard floor + desks */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(68px, 1fr))`,
        }}
      >
        {agents.map(dna => (
          <Desk
            key={dna.id}
            dna={dna}
            status={statusMap[dna.id] ?? 'idle'}
            onClick={() => onSelectAgent(dna)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Runtime Simulator ────────────────────────────────────────────────────────
// In production: reads from ~/.claude/projects/<session>/jsonl files
// via Pixel Agents VS Code Extension JSONL watcher

const STATUSES: RunStatus[] = ['idle', 'idle', 'idle', 'working', 'analyzing', 'waiting', 'success', 'offline']

function useRuntimeStatus(agents: AgentDNA[]) {
  const [statusMap, setStatusMap] = useState<Record<string, RunStatus>>(() => {
    const map: Record<string, RunStatus> = {}
    agents.forEach(a => { map[a.id] = 'idle' })
    return map
  })

  const tick = useCallback(() => {
    setStatusMap(prev => {
      const next = { ...prev }
      // Randomly update ~15% of agents per tick
      agents.forEach(a => {
        if (Math.random() < 0.15) {
          const s = STATUSES[Math.floor(Math.random() * STATUSES.length)]
          // Success only briefly — auto-revert to idle after 2 ticks
          next[a.id] = s
        }
        // Revert success → idle
        if (prev[a.id] === 'success' && Math.random() < 0.6) next[a.id] = 'idle'
      })
      return next
    })
  }, [agents])

  useEffect(() => {
    const id = setInterval(tick, 2500)
    return () => clearInterval(id)
  }, [tick])

  return statusMap
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-none border border-white/8 bg-white/3">
      <span className="text-[9px] text-white/30 font-mono uppercase tracking-widest mr-1">Status:</span>
      {(Object.entries(STATUS_META) as [RunStatus, typeof STATUS_META[RunStatus]][])
        .filter(([k]) => k !== 'idle')
        .map(([status, meta]) => (
          <div key={status} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-none" style={{ background: meta.bubbleColor }} />
            <span className="text-[9px] text-white/40 font-mono capitalize">{status}</span>
          </div>
        ))}
      <div className="ml-auto text-[9px] text-white/20 font-mono">
        mock live · connected to local models
      </div>
    </div>
  )
}

// ─── AI Office Customizer Panel ──────────────────────────────────────────────
// Connects to local AI models (OpenClaw / HiClaw / Ollama) on the machine
// No VS Code extension needed — pure web interface

type LocalModel = { id: string; name: string; provider: string; status: 'connected' | 'offline' }

const DEFAULT_MODELS: LocalModel[] = [
  { id: 'openclaw',   name: 'OpenClaw',   provider: 'Local · port 11434', status: 'connected' },
  { id: 'hiclaw',     name: 'HiClaw',     provider: 'Local · port 11435', status: 'connected' },
  { id: 'ollama',     name: 'Ollama',     provider: 'Local · port 11434', status: 'offline'   },
  { id: 'lm-studio',  name: 'LM Studio',  provider: 'Local · port 1234',  status: 'offline'   },
]

function AiCustomizerPanel({
  onClose,
  onApplyCommand,
}: {
  onClose: () => void
  onApplyCommand: (cmd: string) => void
}) {
  const [models] = useState<LocalModel[]>(DEFAULT_MODELS)
  const [selectedModel, setSelectedModel] = useState('openclaw')
  const [prompt, setPrompt] = useState('')
  const [thinking, setThinking] = useState(false)
  const [lastResult, setLastResult] = useState('')

  const PRESETS = [
    'ให้ทุกคนใน L1 ทำงานพร้อมกัน',
    'L4 Orchestrator (Gengo) ทำงานหนัก',
    'ทั้ง office พักหมด ยกเว้น Kai',
    'L2 Analysis ทุกคนวิเคราะห์ข้อมูล',
    'แสดง error ที่ L3 Decision',
    'ทุก agent ทำงานพร้อมกัน (full team)',
  ]

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    setThinking(true)
    try {
      const res = await fetch('/api/ai-customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel, prompt }),
      })
      const data = await res.json() as { message?: string; overrides?: Record<string, string> }
      onApplyCommand(prompt)
      setLastResult(`✓ ${data.message ?? 'Applied'}`)
    } catch {
      // Fallback: still apply client-side keyword parse
      onApplyCommand(prompt)
      setLastResult(`✓ Applied (offline mode): "${prompt}"`)
    }
    setPrompt('')
    setThinking(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-none border-2 border-yellow-500/40 bg-[#0A1628] p-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-yellow-400 font-mono font-bold text-sm tracking-wider uppercase">🤖 AI Office Customizer</div>
            <div className="text-white/30 text-[10px] font-mono mt-0.5">สั่งงาน office ด้วย AI — ไม่ต้อง install extension</div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94A3B8',
            width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 14,
          }}>✕</button>
        </div>

        {/* Local model selector */}
        <div className="mb-4">
          <div className="text-[9px] text-white/30 font-mono uppercase tracking-wider mb-2">Local AI Models</div>
          <div className="grid grid-cols-2 gap-2">
            {models.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                style={{
                  background: selectedModel === m.id ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.04)',
                  border: selectedModel === m.id ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '8px 10px', cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: selectedModel === m.id ? '#F5A623' : '#94A3B8', fontFamily: 'monospace' }}>{m.name}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                    background: m.status === 'connected' ? '#10B98122' : '#EF444422',
                    color: m.status === 'connected' ? '#10B981' : '#EF4444',
                  }}>{m.status === 'connected' ? '● ON' : '○ OFF'}</span>
                </div>
                <div style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace', marginTop: 2 }}>{m.provider}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt presets */}
        <div className="mb-3">
          <div className="text-[9px] text-white/30 font-mono uppercase tracking-wider mb-2">คำสั่งด่วน</div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button key={p} onClick={() => setPrompt(p)} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, padding: '4px 9px', cursor: 'pointer', fontSize: 10,
                color: '#94A3B8', fontFamily: 'monospace', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,166,35,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#F5A623' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8' }}
              >{p}</button>
            ))}
          </div>
        </div>

        {/* Prompt input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="สั่ง office ด้วยภาษาไทยหรืออังกฤษ..."
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#F1F5F9', fontSize: 12, fontFamily: 'monospace', outline: 'none',
            }}
          />
          <button onClick={handleSubmit} disabled={thinking} style={{
            padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: thinking ? 'rgba(245,166,35,0.3)' : 'rgba(245,166,35,0.9)',
            color: '#0A1628', fontWeight: 700, fontSize: 12, fontFamily: 'monospace',
            minWidth: 60,
          }}>
            {thinking ? '...' : 'Send'}
          </button>
        </div>

        {lastResult && (
          <div style={{ marginTop: 10, fontSize: 10, color: '#10B981', fontFamily: 'monospace' }}>{lastResult}</div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PixelOfficeView({ onSelectAgent }: { onSelectAgent: (dna: AgentDNA) => void }) {
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [overrideMap, setOverrideMap] = useState<Record<string, RunStatus>>({})

  const agentsByLayer = {
    L1: AGENT_DNA.filter(a => a.layer === 'L1'),
    L2: AGENT_DNA.filter(a => a.layer === 'L2'),
    L3: AGENT_DNA.filter(a => a.layer === 'L3'),
    L4: AGENT_DNA.filter(a => a.layer === 'L4'),
    L5: AGENT_DNA.filter(a => a.layer === 'L5'),
    Kai: AGENT_DNA.filter(a => a.layer === 'Kai'),
  }

  const baseStatusMap = useRuntimeStatus(AGENT_DNA)
  // Merge override on top of runtime simulation
  const statusMap = { ...baseStatusMap, ...overrideMap }

  // Parse natural language AI command into status overrides
  const handleAiCommand = useCallback((cmd: string) => {
    const lower = cmd.toLowerCase()
    const newOverrides: Record<string, RunStatus> = {}

    const setLayer = (layer: string, status: RunStatus) => {
      AGENT_DNA.filter(a => a.layer === layer).forEach(a => { newOverrides[a.id] = status })
    }

    if (lower.includes('ทุก') && (lower.includes('ทำงาน') || lower.includes('full team'))) {
      AGENT_DNA.forEach(a => { newOverrides[a.id] = 'working' })
    } else if (lower.includes('พัก') || lower.includes('idle')) {
      AGENT_DNA.forEach(a => { newOverrides[a.id] = 'idle' })
    } else if (lower.includes('l1') || lower.includes('perception')) {
      setLayer('L1', lower.includes('error') ? 'error' : lower.includes('วิเคราะห์') || lower.includes('analy') ? 'analyzing' : 'working')
    } else if (lower.includes('l2') || lower.includes('analysis') || lower.includes('วิเคราะห์')) {
      setLayer('L2', 'analyzing')
    } else if (lower.includes('l3') || lower.includes('decision')) {
      setLayer('L3', lower.includes('error') ? 'error' : 'working')
    } else if (lower.includes('l4') || lower.includes('orchestrat') || lower.includes('coord')) {
      setLayer('L4', 'working')
    } else if (lower.includes('gengo') || lower.includes('orchestrator')) {
      const gengo = AGENT_DNA.find(a => a.codename === 'gengo')
      if (gengo) newOverrides[gengo.id] = 'working'
    } else if (lower.includes('kai')) {
      const kai = AGENT_DNA.find(a => a.codename === 'kai')
      if (kai) newOverrides[kai.id] = 'working'
      AGENT_DNA.filter(a => a.codename !== 'kai').forEach(a => { newOverrides[a.id] = 'idle' })
    } else if (lower.includes('error')) {
      AGENT_DNA.filter(a => a.layer === 'L3').forEach(a => { newOverrides[a.id] = 'error' })
    }

    setOverrideMap(newOverrides)
    // Auto-clear overrides after 8 seconds
    setTimeout(() => setOverrideMap({}), 8000)
  }, [])

  const totalActive = Object.values(statusMap).filter(s => ['working', 'analyzing', 'waiting'].includes(s)).length

  return (
    <>
      {/* CSS keyframe animations */}
      <style>{`
        @keyframes char-idle {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-1px); }
        }
        @keyframes char-work {
          0%   { transform: translateY(0px) rotate(-2deg); }
          100% { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes char-read {
          0%, 100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }
        @keyframes char-wait {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes char-shake {
          0%   { transform: translateX(-2px); }
          100% { transform: translateX(2px); }
        }
        @keyframes char-jump {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes bubble-pulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50%      { opacity: 0.6; transform: translateX(-50%) scale(1.2); }
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.2; }
        }
        @keyframes desk-glow {
          from { box-shadow: 0 0 0 transparent; }
          to   { box-shadow: 0 0 8px -2px var(--glow-color); }
        }
        @keyframes floor-scroll {
          from { background-position: 0 0; }
          to   { background-position: 16px 16px; }
        }
      `}</style>

      {/* Office header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none border-2 border-yellow-500/50 flex items-center justify-center bg-yellow-500/10">
            <span className="text-yellow-400 text-sm">⚔</span>
          </div>
          <div>
            <div className="text-white font-mono font-bold text-sm tracking-wider">SIRINX PIXEL OFFICE</div>
            <div className="text-white/30 text-[10px] font-mono">47 Ronin + Kai · {totalActive} agents active</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 border border-green-500/30 bg-green-500/10 rounded-none">
            <div className="w-1.5 h-1.5 rounded-none bg-green-400" style={{ animation: 'dot-blink 1s ease-in-out infinite' }} />
            <span className="text-[9px] font-mono text-green-400">MOCK LIVE</span>
          </div>
          <button
            onClick={() => setShowCustomizer(s => !s)}
            className="px-3 py-1 text-[10px] font-mono border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 transition-colors rounded-none"
          >
            🤖 AI Customize
          </button>
        </div>
      </div>

      <Legend />

      {/* Office floor */}
      <div
        className="mt-4 p-4 rounded-none border-2 border-white/10 relative overflow-hidden"
        style={{
          background: `
            repeating-conic-gradient(#0A1628 0% 25%, #0B1E32 0% 50%)
            0 0 / 16px 16px
          `,
          minHeight: 400,
        }}
      >
        {/* Office walls (decorative) */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, rgba(245,166,35,0.03) 0%, transparent 30%)',
        }} />

        {/* Department rooms grid */}
        <div className="relative z-10 grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {Object.entries(agentsByLayer).map(([layer, agents]) => (
            <DepartmentRoom
              key={layer}
              layer={layer}
              agents={agents}
              statusMap={statusMap}
              onSelectAgent={onSelectAgent}
            />
          ))}
        </div>
      </div>

      {showCustomizer && (
        <AiCustomizerPanel
          onClose={() => setShowCustomizer(false)}
          onApplyCommand={handleAiCommand}
        />
      )}
    </>
  )
}
