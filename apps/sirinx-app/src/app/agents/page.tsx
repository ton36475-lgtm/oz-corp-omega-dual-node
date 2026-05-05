'use client'
import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {
  AGENT_DNA, LAYER_COLORS, LAYER_LABELS, MODEL_LABELS, STATUS_COLORS, LAYER_ORDER,
  type AgentDNA,
} from '@/data/agent-dna-data'

const PixelOfficeView = dynamic(() => import('@/components/agents/PixelOfficeView'), { ssr: false })

// ─── Layer Filter Tab ────────────────────────────────────────────────────────
function LayerTab({ layer, active, onClick }: { layer: string; active: boolean; onClick: () => void }) {
  const color = LAYER_COLORS[layer] ?? '#94A3B8'
  const label = layer === 'all' ? 'All Agents' : LAYER_LABELS[layer] ?? layer
  const count = layer === 'all' ? AGENT_DNA.length : AGENT_DNA.filter(a => a.layer === layer).length
  return (
    <button onClick={onClick} style={{
      padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
      cursor: 'pointer', transition: 'all 0.15s', border: 'none',
      background: active ? `${color}22` : 'rgba(255,255,255,0.04)',
      color: active ? color : '#64748B',
      outline: active ? `1px solid ${color}44` : '1px solid rgba(255,255,255,0.06)',
    }}>
      {label} <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 4 }}>{count}</span>
    </button>
  )
}

// ─── DNA Card ────────────────────────────────────────────────────────────────
function DnaCard({ dna, onClick }: { dna: AgentDNA; onClick: () => void }) {
  const color = LAYER_COLORS[dna.layer] ?? '#94A3B8'
  return (
    <div onClick={onClick} style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}22`,
      borderRadius: 12, padding: '18px 20px',
      cursor: 'pointer', transition: 'all 0.2s',
      position: 'relative', overflow: 'hidden',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLDivElement
      el.style.background = 'rgba(255,255,255,0.07)'
      el.style.borderColor = `${color}55`
      el.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLDivElement
      el.style.background = 'rgba(255,255,255,0.04)'
      el.style.borderColor = `${color}22`
      el.style.transform = 'translateY(0)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
            #{String(dna.number).padStart(2,'0')} · {dna.layerLabel}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>{dna.displayName}</div>
          <div style={{ fontSize: 20, color, marginTop: 1 }}>{dna.roninKanji}</div>
        </div>
        <div style={{
          background: `${STATUS_COLORS[dna.status]}22`, color: STATUS_COLORS[dna.status],
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
          textTransform: 'uppercase', letterSpacing: '1px',
        }}>{dna.status}</div>
      </div>
      {/* Role + Mission */}
      <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>{dna.role}</div>
      <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, marginBottom: 12,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {dna.mission}
      </div>
      {/* Footer metrics */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, color: '#64748B', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 4 }}>
          {MODEL_LABELS[dna.llmModel]}
        </span>
        <span style={{ fontSize: 10, color: '#64748B', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 4 }}>
          {dna.tokenBudget.toLocaleString()} tokens
        </span>
        <span style={{ fontSize: 10, color: '#64748B', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 4 }}>
          {dna.activationFrequency}
        </span>
      </div>
    </div>
  )
}

// ─── DNA Modal ───────────────────────────────────────────────────────────────
function DnaModal({ dna, onClose }: { dna: AgentDNA; onClose: () => void }) {
  const color = LAYER_COLORS[dna.layer] ?? '#94A3B8'
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24, backdropFilter: 'blur(4px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0D1F35', border: `1px solid ${color}44`,
        borderRadius: 16, width: '100%', maxWidth: 680, maxHeight: '90vh',
        overflow: 'auto', padding: 32,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>
              RONIN #{String(dna.number).padStart(2,'0')} · {dna.layerLabel}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#F1F5F9', marginBottom: 2 }}>{dna.displayName}</div>
            <div style={{ fontSize: 32, color }}>{dna.roninKanji}</div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94A3B8',
            width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18,
          }}>✕</button>
        </div>

        {/* Status badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: dna.status.toUpperCase(), bg: `${STATUS_COLORS[dna.status]}22`, fg: STATUS_COLORS[dna.status] },
            { label: MODEL_LABELS[dna.llmModel], bg: `${color}15`, fg: color },
            { label: dna.activationFrequency, bg: 'rgba(255,255,255,0.06)', fg: '#94A3B8' },
            { label: `${dna.tokenBudget.toLocaleString()} tokens`, bg: 'rgba(255,255,255,0.06)', fg: '#94A3B8' },
            { label: `${dna.avgResponseMs}ms avg`, bg: 'rgba(255,255,255,0.06)', fg: '#94A3B8' },
            { label: `฿${dna.costPerCall}/call`, bg: 'rgba(255,255,255,0.06)', fg: '#94A3B8' },
          ].map(b => (
            <span key={b.label} style={{
              background: b.bg, color: b.fg,
              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
              letterSpacing: '0.5px',
            }}>{b.label}</span>
          ))}
        </div>

        {/* Mission */}
        <Section title="Mission" color={color}>
          <p style={{ color: '#CBD5E1', lineHeight: 1.7, margin: 0, fontSize: 14 }}>{dna.mission}</p>
        </Section>

        {/* Personality */}
        <Section title="Personality" color={color}>
          <p style={{ color: '#94A3B8', lineHeight: 1.6, margin: 0, fontSize: 13, fontStyle: 'italic' }}>{dna.personality}</p>
        </Section>

        {/* Strengths & Limitations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <Section title="Strengths" color="#10B981">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {dna.strengths.map((s, i) => (
                <li key={i} style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7 }}>{s}</li>
              ))}
            </ul>
          </Section>
          <Section title="Limitations" color="#EF4444">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {dna.limitations.map((l, i) => (
                <li key={i} style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7 }}>{l}</li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Triggers */}
        <Section title="Trigger Conditions" color={color}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dna.triggerConditions.map((t, i) => (
              <span key={i} style={{
                background: `${color}11`, color: '#94A3B8',
                fontSize: 11, padding: '4px 10px', borderRadius: 6,
                border: `1px solid ${color}22`,
              }}>{t}</span>
            ))}
          </div>
        </Section>

        {/* KPIs */}
        <Section title="KPIs" color={color}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {dna.kpis.map((k, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color, fontSize: 12 }}>▸</span>
                <span style={{ color: '#94A3B8', fontSize: 13 }}>{k}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Output Format */}
        <Section title="Output Format" color={color}>
          <code style={{
            display: 'block', background: 'rgba(0,0,0,0.3)', borderRadius: 8,
            padding: '12px 16px', fontSize: 11, color: '#7DD3FC',
            fontFamily: 'monospace', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>{dna.outputFormat}</code>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [view, setView] = useState<'dna' | 'pixel'>('dna')
  const [activeLayer, setActiveLayer] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AgentDNA | null>(null)

  const filtered = useMemo(() => {
    let list = AGENT_DNA
    if (activeLayer !== 'all') list = list.filter(a => a.layer === activeLayer)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.displayName.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.mission.toLowerCase().includes(q) ||
        a.codename.toLowerCase().includes(q) ||
        a.roninKanji.includes(q)
      )
    }
    return list
  }, [activeLayer, search])

  // Group by layer for "all" view
  const grouped = useMemo(() => {
    if (activeLayer !== 'all') return { [activeLayer]: filtered }
    const g: Record<string, AgentDNA[]> = {}
    for (const layer of LAYER_ORDER) {
      const items = filtered.filter(a => a.layer === layer)
      if (items.length > 0) g[layer] = items
    }
    return g
  }, [filtered, activeLayer])

  const totalCost = useMemo(() => AGENT_DNA.reduce((s, a) => s + a.costPerCall, 0).toFixed(2), [])

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 8 }}>
          SIRINX · 47 Ronin
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#F1F5F9', margin: '0 0 8px', lineHeight: 1.1 }}>
          Agent DNA Command Center
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
          {AGENT_DNA.length} agents · 5 layers · Full role definitions, KPIs, and operational specs
        </p>
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([['dna', '⚔ DNA Command Center'], ['pixel', '🏯 Pixel Office']] as const).map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            background: view === v ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)',
            color: view === v ? '#F5A623' : '#64748B',
            outline: view === v ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.06)',
          }}>{label}</button>
        ))}
      </div>

      {/* Pixel Office view */}
      {view === 'pixel' && (
        <PixelOfficeView onSelectAgent={setSelected} />
      )}

      {view === 'dna' && <>
      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Agents', value: '48' },
          { label: 'Active',       value: String(AGENT_DNA.filter(a => a.status === 'active').length) },
          { label: 'Layers',       value: '5 + Kai' },
          { label: 'LLM Models',   value: '4' },
          { label: 'Cost / run',   value: `฿${totalCost}` },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '14px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#F5A623' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Layer tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <LayerTab layer="all" active={activeLayer === 'all'} onClick={() => setActiveLayer('all')} />
          {LAYER_ORDER.map(l => (
            <LayerTab key={l} layer={l} active={activeLayer === l} onClick={() => setActiveLayer(l)} />
          ))}
        </div>
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search agents..."
          style={{
            marginLeft: 'auto', padding: '8px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#F1F5F9', fontSize: 13, outline: 'none', minWidth: 200,
          }}
        />
      </div>

      {/* Agent Grid — grouped by layer */}
      {Object.entries(grouped).map(([layer, agents]) => (
        <div key={layer} style={{ marginBottom: 36 }}>
          {/* Layer header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ height: 1, flex: 1, background: `${LAYER_COLORS[layer] ?? '#94A3B8'}33` }} />
            <span style={{
              fontSize: 12, fontWeight: 700, color: LAYER_COLORS[layer] ?? '#94A3B8',
              letterSpacing: '2px', textTransform: 'uppercase',
            }}>
              {LAYER_LABELS[layer] ?? layer} · {agents.length} agents
            </span>
            <div style={{ height: 1, flex: 1, background: `${LAYER_COLORS[layer] ?? '#94A3B8'}33` }} />
          </div>
          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {agents.map(dna => (
              <DnaCard key={dna.id} dna={dna} onClick={() => setSelected(dna)} />
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#64748B' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚔</div>
          <div style={{ fontSize: 16 }}>No agents found for "{search}"</div>
        </div>
      )}

      {/* Modal */}
      {selected && <DnaModal dna={selected} onClose={() => setSelected(null)} />}
      </>}
    </div>
  )
}
