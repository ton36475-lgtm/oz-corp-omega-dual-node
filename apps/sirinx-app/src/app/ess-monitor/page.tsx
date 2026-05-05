'use client'
import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const essSystems = [
  {
    id: 'ESS-001',
    name: 'Battery Bank A — ไทยเหล็กสยาม',
    location: 'นิคมอุตสาหกรรม บางปะอิน',
    capacity: 500,
    currentCharge: 342,
    soc: 68.4,
    status: 'discharging',
    power: -120,
    temp: 31.2,
    cycles: 248,
    health: 97.3,
    voltage: 768.4,
    current: -156.2,
    chemistry: 'LFP (LiFePO₄)',
    warrantyYears: 10,
    installDate: '15 ม.ค. 2025',
  },
  {
    id: 'ESS-002',
    name: 'Battery Bank — โรงแรม แกรนด์ รอยัล',
    location: 'พิษณุโลก',
    capacity: 200,
    currentCharge: 182,
    soc: 91.0,
    status: 'standby',
    power: 0,
    temp: 28.8,
    cycles: 142,
    health: 99.1,
    voltage: 812.1,
    current: 0,
    chemistry: 'LFP (LiFePO₄)',
    warrantyYears: 10,
    installDate: '3 มี.ค. 2025',
  },
  {
    id: 'ESS-003',
    name: 'Grid-Scale ESS — มหาวิทยาลัยนเรศวร',
    location: 'ตำบลท่าโพธิ์ พิษณุโลก',
    capacity: 2000,
    currentCharge: 1540,
    soc: 77.0,
    status: 'charging',
    power: 350,
    temp: 33.1,
    cycles: 89,
    health: 99.8,
    voltage: 1536.0,
    current: 228.1,
    chemistry: 'LFP (LiFePO₄)',
    warrantyYears: 15,
    installDate: '20 ธ.ค. 2025',
  },
  {
    id: 'ESS-004',
    name: 'ESS Backup — ล็อกซเล่ย์ โลจิสติกส์',
    location: 'นิคมอุตสาหกรรม พิษณุโลก',
    capacity: 800,
    currentCharge: 120,
    soc: 15.0,
    status: 'alarm',
    power: -45,
    temp: 38.9,
    cycles: 312,
    health: 94.2,
    voltage: 724.8,
    current: -62.1,
    chemistry: 'NMC',
    warrantyYears: 8,
    installDate: '1 ต.ค. 2025',
  },
]

const energyFlow24h = [
  { time: '00:00', solar: 0, battery: -40, grid: 40 },
  { time: '02:00', solar: 0, battery: -35, grid: 35 },
  { time: '04:00', solar: 0, battery: -28, grid: 28 },
  { time: '06:00', solar: 18, battery: -10, grid: 0 },
  { time: '08:00', solar: 142, battery: 82, grid: 0 },
  { time: '10:00', solar: 248, battery: 178, grid: 0 },
  { time: '12:00', solar: 312, battery: 220, grid: 0 },
  { time: '14:00', solar: 289, battery: 190, grid: 0 },
  { time: '16:00', solar: 198, battery: 98, grid: 0 },
  { time: '18:00', solar: 42, battery: -120, grid: 78 },
  { time: '20:00', solar: 0, battery: -180, grid: 180 },
  { time: '22:00', solar: 0, battery: -95, grid: 95 },
]

const socHistory = [
  { time: '00:00', soc: 82 },
  { time: '02:00', soc: 74 },
  { time: '04:00', soc: 68 },
  { time: '06:00', soc: 65 },
  { time: '08:00', soc: 71 },
  { time: '10:00', soc: 82 },
  { time: '12:00', soc: 93 },
  { time: '14:00', soc: 98 },
  { time: '16:00', soc: 88 },
  { time: '18:00', soc: 75 },
  { time: '20:00', soc: 62 },
  { time: '22:00', soc: 56 },
]

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  charging: { label: 'กำลังชาร์จ', color: '#10B981', icon: '⚡' },
  discharging: { label: 'กำลังจ่ายไฟ', color: '#06B6D4', icon: '🔋' },
  standby: { label: 'Standby', color: '#64748B', icon: '⏸' },
  alarm: { label: 'แจ้งเตือน!', color: '#EF4444', icon: '⚠️' },
}

export default function ESSMonitorPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedESS, setSelectedESS] = useState<typeof essSystems[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'history'>('overview')
  useEffect(() => setMounted(true), [])

  const totalCapacity = essSystems.reduce((s, e) => s + e.capacity, 0)
  const totalCharge = essSystems.reduce((s, e) => s + e.currentCharge, 0)
  const avgSoC = (totalCharge / totalCapacity) * 100
  const alarmCount = essSystems.filter(e => e.status === 'alarm').length

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
            ESS Battery Monitor
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            Battery Energy Storage Systems {essSystems.length} ระบบ · ความจุรวม {totalCapacity.toLocaleString()} kWh
          </p>
        </div>
        {alarmCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
            animation: 'pulse 2s infinite',
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>{alarmCount} ระบบแจ้งเตือน!</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'ความจุรวม', value: `${(totalCapacity / 1000).toFixed(1)} MWh`, sub: 'Total Capacity', color: '#06B6D4' },
          { label: 'พลังงานที่เก็บ', value: `${(totalCharge / 1000).toFixed(2)} MWh`, sub: `SoC ${avgSoC.toFixed(1)}%`, color: '#10B981' },
          { label: 'สุขภาพเฉลี่ย', value: `${(essSystems.reduce((s, e) => s + e.health, 0) / essSystems.length).toFixed(1)}%`, sub: 'Average SoH', color: '#F5A623' },
          { label: 'Charge Cycles รวม', value: `${essSystems.reduce((s, e) => s + e.cycles, 0)}`, sub: 'Total Cycles', color: '#A855F7' },
        ].map((kpi, i) => (
          <div key={i} className="glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, marginBottom: 6 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: '#334155' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['overview', 'flow', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 18px',
            background: activeTab === tab ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${activeTab === tab ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, color: activeTab === tab ? '#06B6D4' : '#64748B',
            fontSize: 13, cursor: 'pointer', fontWeight: activeTab === tab ? 600 : 400,
          }}>
            {tab === 'overview' ? 'Battery Systems' : tab === 'flow' ? 'Energy Flow' : 'SoC History'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {essSystems.map((ess, i) => {
            const st = statusMap[ess.status]
            const socColor = ess.soc < 20 ? '#EF4444' : ess.soc < 40 ? '#F5A623' : '#10B981'
            return (
              <div key={ess.id} className="glass" style={{
                padding: '20px 24px',
                borderLeft: `3px solid ${st.color}`,
                cursor: 'pointer',
              }}
                onClick={() => setSelectedESS(ess)}
                onMouseEnter={e => (e.currentTarget.style.borderColor = st.color)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>{ess.id}</span>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 10,
                        background: `${st.color}18`, color: st.color, border: `1px solid ${st.color}38`,
                      }}>{st.icon} {st.label}</span>
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#F1F5F9' }}>{ess.name}</h3>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{ess.location} · {ess.chemistry}</div>
                  </div>

                  {/* SoC Gauge */}
                  <div style={{ textAlign: 'center', minWidth: 140 }}>
                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>State of Charge</div>
                    <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 6 }}>
                      <div style={{
                        position: 'absolute', left: 0, top: 0, height: '100%',
                        width: `${ess.soc}%`,
                        background: `linear-gradient(90deg, ${socColor}, ${socColor}88)`,
                        borderRadius: 4, transition: 'width 1s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: socColor }}>{ess.soc.toFixed(1)}%</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{ess.currentCharge.toLocaleString()} / {ess.capacity.toLocaleString()} kWh</div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, minWidth: 240 }}>
                    {[
                      { label: 'Power', value: `${ess.power >= 0 ? '+' : ''}${ess.power} kW`, color: ess.power > 0 ? '#10B981' : ess.power < 0 ? '#06B6D4' : '#64748B' },
                      { label: 'Temp', value: `${ess.temp}°C`, color: ess.temp > 35 ? '#EF4444' : '#94A3B8' },
                      { label: 'Health', value: `${ess.health}%`, color: ess.health > 95 ? '#10B981' : '#F5A623' },
                      { label: 'Cycles', value: `${ess.cycles}`, color: '#A855F7' },
                    ].map((m, j) => (
                      <div key={j} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
                        <div style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>{m.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'flow' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="glass" style={{ padding: '20px 22px' }}>
            <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Energy Flow 24 ชั่วโมง (kWh)</h3>
            {mounted ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={energyFlow24h} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0F2040', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="solar" name="Solar" stroke="#F5A623" fill="rgba(245,166,35,0.15)" strokeWidth={2} />
                  <Area type="monotone" dataKey="battery" name="Battery" stroke="#06B6D4" fill="rgba(6,182,212,0.1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>กำลังโหลด...</div>}
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {[{ color: '#F5A623', label: 'Solar Generation' }, { color: '#06B6D4', label: 'Battery (+ = Charge, - = Discharge)' }].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 3, background: l.color, borderRadius: 2 }} />
                  <span style={{ fontSize: 11, color: '#64748B' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass" style={{ padding: '20px 22px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Energy Flow Diagram</h3>
            <p style={{ margin: '0 0 20px', fontSize: 11, color: '#475569' }}>สถานะปัจจุบัน 09:30 น.</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '10px 0' }}>
              {/* Solar */}
              <div style={{
                padding: '14px 28px', background: 'rgba(245,166,35,0.1)', border: '2px solid rgba(245,166,35,0.4)',
                borderRadius: 12, textAlign: 'center',
              }}>
                <div style={{ fontSize: 20 }}>☀️</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F5A623' }}>Solar Array</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#F5A623' }}>+688 kW</div>
              </div>
              <div style={{ fontSize: 20, color: '#F5A623' }}>↓</div>
              {/* Inverter */}
              <div style={{
                padding: '10px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>⚡ Hybrid Inverter</div>
                <div style={{ fontSize: 11, color: '#475569' }}>Efficiency 97.2%</div>
              </div>
              <div style={{ display: 'flex', gap: 40, width: '100%', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, color: '#10B981', marginBottom: 4 }}>↓</div>
                  <div style={{
                    padding: '12px 20px', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.4)',
                    borderRadius: 10, textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 18 }}>🔋</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>ESS Battery</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}>+430 kW</div>
                    <div style={{ fontSize: 10, color: '#475569' }}>Charging</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, color: '#06B6D4', marginBottom: 4 }}>→</div>
                  <div style={{
                    padding: '12px 20px', background: 'rgba(6,182,212,0.1)', border: '2px solid rgba(6,182,212,0.4)',
                    borderRadius: 10, textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 18 }}>🏭</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#06B6D4' }}>Load</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#06B6D4' }}>258 kW</div>
                    <div style={{ fontSize: 10, color: '#475569' }}>Consumption</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>SoC History — ESS-001 (วันนี้)</h3>
          {mounted ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={socHistory} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#0F2040', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: unknown) => [`${v}%`, 'SoC'] as [string, string]}
                />
                <Area type="monotone" dataKey="soc" stroke="#10B981" fill="rgba(16,185,129,0.15)" strokeWidth={2.5} dot={{ fill: '#10B981', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>กำลังโหลด...</div>}
        </div>
      )}

      {/* Detail Modal */}
      {selectedESS && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setSelectedESS(null)}>
          <div style={{
            background: '#0F1E35', border: `1px solid ${statusMap[selectedESS.status].color}40`, borderRadius: 16,
            padding: '28px 32px', width: 520, maxWidth: '90vw',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{selectedESS.id} · {selectedESS.chemistry}</div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>{selectedESS.name}</h2>
              </div>
              <button onClick={() => setSelectedESS(null)} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, width: 28, height: 28, cursor: 'pointer', color: '#64748B', fontSize: 16,
              }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Capacity', value: `${selectedESS.capacity.toLocaleString()} kWh`, color: '#06B6D4' },
                { label: 'State of Charge', value: `${selectedESS.soc.toFixed(1)}%`, color: '#10B981' },
                { label: 'Voltage', value: `${selectedESS.voltage} V`, color: '#F5A623' },
                { label: 'Current', value: `${selectedESS.current.toFixed(1)} A`, color: '#94A3B8' },
                { label: 'Temperature', value: `${selectedESS.temp}°C`, color: selectedESS.temp > 35 ? '#EF4444' : '#94A3B8' },
                { label: 'State of Health', value: `${selectedESS.health}%`, color: '#10B981' },
                { label: 'Charge Cycles', value: `${selectedESS.cycles}`, color: '#A855F7' },
                { label: 'Warranty', value: `${selectedESS.warrantyYears} ปี`, color: '#64748B' },
              ].map((row, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: row.color }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
