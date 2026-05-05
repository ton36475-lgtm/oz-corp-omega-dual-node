'use client'
import { useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface CommandResult {
  command: string
  fullCmd: string
  stdout: string
  stderr: string
  success: boolean
  timestamp: string
}

interface CommandDef {
  id: string
  label: string
  icon: string
  description: string
  color: string
  category: string
}

// ─── Command Definitions ──────────────────────────────────────────────────────
const COMMANDS: CommandDef[] = [
  // Gateway & Health
  { id: 'health',         label: 'Health Check',     icon: '💚', description: 'ตรวจสอบสถานะ gateway ทั้งหมด',          color: '#10B981', category: 'Gateway' },
  { id: 'status',         label: 'Channel Status',   icon: '📡', description: 'ดู channel และ session ที่ active',    color: '#10B981', category: 'Gateway' },
  { id: 'gateway_status', label: 'Gateway Status',   icon: '🔌', description: 'ดู WebSocket gateway connection info', color: '#10B981', category: 'Gateway' },
  { id: 'version',        label: 'Version',          icon: '🦞', description: 'แสดง OpenClaw version',                color: '#64748B', category: 'Gateway' },
  // Models
  { id: 'models',         label: 'Model Status',     icon: '🧠', description: 'ดู AI models ที่ configured ทั้งหมด',  color: '#A855F7', category: 'Models' },
  { id: 'models_scan',    label: 'Scan Models',      icon: '🔍', description: 'Scan หา local models (Ollama etc.)',   color: '#A855F7', category: 'Models' },
  // Agents
  { id: 'agents',         label: 'List Agents',      icon: '⚔',  description: 'แสดง agent workspaces ทั้งหมด',       color: '#F5A623', category: 'Agents' },
  { id: 'sessions',       label: 'Sessions',         icon: '💬', description: 'แสดง conversation sessions',          color: '#F5A623', category: 'Agents' },
  { id: 'skills',         label: 'List Skills',      icon: '⚡', description: 'แสดง skills ที่ load ไว้ทั้งหมด',     color: '#F5A623', category: 'Agents' },
  // System
  { id: 'memory_status',  label: 'Memory Status',    icon: '🧮', description: 'ดูสถานะ memory search และ index',      color: '#06B6D4', category: 'System' },
  { id: 'logs',           label: 'Tail Logs',        icon: '📋', description: 'ดู gateway logs ล่าสุด 20 บรรทัด',    color: '#64748B', category: 'System' },
]

const CATEGORIES = ['Gateway', 'Models', 'Agents', 'System']

// ─── Terminal Output ──────────────────────────────────────────────────────────
function TerminalOutput({ result }: { result: CommandResult | null; loading: boolean }) {
  if (!result) return (
    <div style={{
      background: '#050D1A', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, padding: '24px 20px', minHeight: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: 13, color: '#334155', fontFamily: 'monospace' }}>
        ← คลิกคำสั่งด้านซ้ายเพื่อรัน
      </span>
    </div>
  )

  return (
    <div style={{
      background: '#050D1A', border: `1px solid ${result.success ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
      borderRadius: 10, overflow: 'hidden',
    }}>
      {/* Terminal header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        background: result.success ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
        borderBottom: `1px solid ${result.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#475569' }}>$</span>
          <code style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'monospace' }}>{result.fullCmd}</code>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, fontFamily: 'monospace',
            background: result.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
            color: result.success ? '#10B981' : '#EF4444',
          }}>{result.success ? '✓ OK' : '✕ ERROR'}</span>
          <span style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>
            {new Date(result.timestamp).toLocaleTimeString('th-TH')}
          </span>
        </div>
      </div>
      {/* Output */}
      <pre style={{
        margin: 0, padding: '16px 20px', fontSize: 12, lineHeight: 1.7,
        color: result.success ? '#7DD3FC' : '#FCA5A5',
        fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        maxHeight: 480, overflow: 'auto',
      }}>
        {result.stdout || result.stderr || '(no output)'}
        {result.stderr && result.stdout && (
          <span style={{ color: '#FCA5A5', display: 'block', marginTop: 8 }}>
            {`STDERR: ${result.stderr}`}
          </span>
        )}
      </pre>
    </div>
  )
}

// ─── Command Button ───────────────────────────────────────────────────────────
function CmdButton({
  cmd, active, loading, onClick,
}: {
  cmd: CommandDef
  active: boolean
  loading: boolean
  onClick: () => void
}) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 14px', borderRadius: 8, cursor: loading ? 'wait' : 'pointer',
      background: active ? `${cmd.color}18` : 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? cmd.color + '44' : 'rgba(255,255,255,0.06)'}`,
      textAlign: 'left', width: '100%', transition: 'all 0.15s',
      opacity: loading && !active ? 0.5 : 1,
    }}
    onMouseEnter={e => {
      if (!loading) {
        (e.currentTarget as HTMLButtonElement).style.background = `${cmd.color}10`
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${cmd.color}33`
      }
    }}
    onMouseLeave={e => {
      if (!active) {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'
      }
    }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{cmd.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: active ? cmd.color : '#CBD5E1', fontFamily: 'monospace' }}>
          {cmd.label}
          {active && loading && <span style={{ fontSize: 10, marginLeft: 6, color: cmd.color, animation: 'dot-blink 0.8s infinite' }}>●</span>}
        </div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{cmd.description}</div>
      </div>
    </button>
  )
}

// ─── Gateway Status Bar ───────────────────────────────────────────────────────
function GatewayBar({ online }: { online: boolean | null }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 16px', borderRadius: 8,
      background: online === true ? 'rgba(16,185,129,0.08)' : online === false ? 'rgba(239,68,68,0.08)' : 'rgba(100,116,139,0.08)',
      border: `1px solid ${online === true ? 'rgba(16,185,129,0.25)' : online === false ? 'rgba(239,68,68,0.25)' : 'rgba(100,116,139,0.15)'}`,
      marginBottom: 24,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: online === true ? '#10B981' : online === false ? '#EF4444' : '#64748B',
        animation: online === true ? 'dot-blink 2s ease-in-out infinite' : 'none',
      }} />
      <span style={{ fontSize: 12, fontFamily: 'monospace', color: online === true ? '#10B981' : online === false ? '#EF4444' : '#64748B', fontWeight: 700 }}>
        OpenClaw Gateway — {online === true ? 'ONLINE · ws://127.0.0.1:18789' : online === false ? 'OFFLINE' : 'Checking...'}
      </span>
      {online === true && (
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>
          🦞 v2026.3.24 · local mode
        </span>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OpenClawPage() {
  const [activeCmd, setActiveCmd] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CommandResult | null>(null)
  const [history, setHistory] = useState<CommandResult[]>([])
  const [gatewayOnline, setGatewayOnline] = useState<boolean | null>(null)
  const [customCmd, setCustomCmd] = useState('')

  // Auto-check gateway health on mount
  useEffect(() => {
    runCommand('health', true)
  }, [])

  const runCommand = useCallback(async (cmdId: string, silent = false) => {
    if (!silent) {
      setActiveCmd(cmdId)
      setLoading(true)
    }
    try {
      const res = await fetch('/api/openclaw/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdId }),
      })
      const data = await res.json() as CommandResult
      if (!silent) {
        setResult(data)
        setHistory(h => [data, ...h].slice(0, 20))
      }
      if (cmdId === 'health') {
        setGatewayOnline(data.success)
      }
    } catch {
      if (!silent) setGatewayOnline(false)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  const handleCustom = async () => {
    if (!customCmd.trim()) return
    setLoading(true)
    setActiveCmd('custom')
    try {
      const res = await fetch('/api/openclaw/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: customCmd.trim() }),
      })
      const data = await res.json() as CommandResult
      setResult(data)
      setHistory(h => [data, ...h].slice(0, 20))
    } catch (err) {
      setResult({
        command: customCmd, fullCmd: customCmd,
        stdout: '', stderr: String(err),
        success: false, timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
      setCustomCmd('')
    }
  }

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px' }}>
      <style>{`
        @keyframes dot-blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 8 }}>
          SIRINX · Control Panel
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#F1F5F9', margin: '0 0 6px', lineHeight: 1 }}>
          🦞 OpenClaw Commander
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
          คลิกคำสั่งด้านซ้าย → รันทันที ไม่ต้องพิมพ์ Terminal
        </p>
      </div>

      {/* Gateway status */}
      <GatewayBar online={gatewayOnline} />

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Left: Command Panel */}
        <div>
          {CATEGORIES.map(cat => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {COMMANDS.filter(c => c.category === cat).map(cmd => (
                  <CmdButton
                    key={cmd.id}
                    cmd={cmd}
                    active={activeCmd === cmd.id}
                    loading={loading}
                    onClick={() => runCommand(cmd.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Custom command input */}
          <div style={{ marginTop: 8, padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: '#475569', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>Custom Command</div>
            <input
              value={customCmd}
              onChange={e => setCustomCmd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustom()}
              placeholder="ชื่อคำสั่ง เช่น health, models..."
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#F1F5F9', fontSize: 11, fontFamily: 'monospace', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button onClick={handleCustom} style={{
              marginTop: 6, width: '100%', padding: '8px',
              background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: 6, color: '#F5A623', fontSize: 11, fontWeight: 700,
              fontFamily: 'monospace', cursor: 'pointer',
            }}>▶ Run</button>
          </div>
        </div>

        {/* Right: Output */}
        <div>
          <TerminalOutput result={result} loading={loading} />

          {/* History */}
          {history.length > 1 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10, color: '#334155', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>History</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {history.slice(1, 8).map((h, i) => (
                  <button key={i} onClick={() => setResult(h)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                    textAlign: 'left', transition: 'all 0.1s',
                  }}>
                    <span style={{ fontSize: 10, color: h.success ? '#10B981' : '#EF4444', fontFamily: 'monospace' }}>
                      {h.success ? '✓' : '✕'}
                    </span>
                    <code style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace', flex: 1 }}>{h.fullCmd}</code>
                    <span style={{ fontSize: 9, color: '#334155', fontFamily: 'monospace' }}>
                      {new Date(h.timestamp).toLocaleTimeString('th-TH')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
