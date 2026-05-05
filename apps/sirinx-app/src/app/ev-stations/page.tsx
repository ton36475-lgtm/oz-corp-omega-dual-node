'use client'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const stations = [
  {
    id: 'EV-001',
    name: 'EV Hub พิษณุโลก Plaza',
    location: 'ถนนสิงหวัฒน์ พิษณุโลก',
    ports: 8,
    activePorts: 6,
    status: 'online',
    type: 'DC Fast Charge (150kW)',
    powerOutput: 120,
    todayEnergy: 284,
    todayRevenue: 5680,
    monthRevenue: 148600,
    sessions: 42,
    lastSeen: '2 นาทีที่แล้ว',
    lat: 16.8198,
    lon: 100.2658,
  },
  {
    id: 'EV-002',
    name: 'EV Station โรงแรม แกรนด์ รอยัล',
    location: 'ถนนบรมไตรโลกนาถ พิษณุโลก',
    ports: 4,
    activePorts: 3,
    status: 'online',
    type: 'AC Type 2 (22kW)',
    powerOutput: 44,
    todayEnergy: 98,
    todayRevenue: 1960,
    monthRevenue: 52400,
    sessions: 18,
    lastSeen: '5 นาทีที่แล้ว',
    lat: 16.8215,
    lon: 100.2634,
  },
  {
    id: 'EV-003',
    name: 'EV Charging นิคมอุตสาหกรรม',
    location: 'นิคมอุตสาหกรรม พิษณุโลก',
    ports: 12,
    activePorts: 9,
    status: 'online',
    type: 'DC Ultra Fast (300kW)',
    powerOutput: 210,
    todayEnergy: 512,
    todayRevenue: 10240,
    monthRevenue: 264000,
    sessions: 67,
    lastSeen: '1 นาทีที่แล้ว',
    lat: 16.7982,
    lon: 100.2441,
  },
  {
    id: 'EV-004',
    name: 'EV Station มหาวิทยาลัยนเรศวร',
    location: 'ตำบลท่าโพธิ์ พิษณุโลก',
    ports: 6,
    activePorts: 0,
    status: 'offline',
    type: 'AC Type 2 (22kW)',
    powerOutput: 0,
    todayEnergy: 0,
    todayRevenue: 0,
    monthRevenue: 31200,
    sessions: 0,
    lastSeen: '3 ชั่วโมงที่แล้ว',
    lat: 16.7445,
    lon: 100.1943,
  },
  {
    id: 'EV-005',
    name: 'EV Hub สนามบินพิษณุโลก',
    location: 'ถนนสนามบิน พิษณุโลก',
    ports: 10,
    activePorts: 7,
    status: 'online',
    type: 'DC Fast Charge (150kW)',
    powerOutput: 95,
    todayEnergy: 368,
    todayRevenue: 7360,
    monthRevenue: 192000,
    sessions: 54,
    lastSeen: '8 นาทีที่แล้ว',
    lat: 16.7828,
    lon: 100.2792,
  },
  {
    id: 'EV-006',
    name: 'EV Station อำเภอวังทอง',
    location: 'ถนนวังทอง-นครไทย วังทอง',
    ports: 4,
    activePorts: 2,
    status: 'maintenance',
    type: 'AC Type 2 (22kW)',
    powerOutput: 18,
    todayEnergy: 36,
    todayRevenue: 720,
    monthRevenue: 18400,
    sessions: 6,
    lastSeen: '45 นาทีที่แล้ว',
    lat: 16.9012,
    lon: 100.4321,
  },
]

const hourlyUsage = [
  { hour: '06:00', kw: 42, sessions: 4 },
  { hour: '08:00', kw: 148, sessions: 12 },
  { hour: '10:00', kw: 234, sessions: 19 },
  { hour: '12:00', kw: 312, sessions: 24 },
  { hour: '14:00', kw: 289, sessions: 22 },
  { hour: '16:00', kw: 356, sessions: 28 },
  { hour: '18:00', kw: 421, sessions: 34 },
  { hour: '20:00', kw: 387, sessions: 30 },
  { hour: '22:00', kw: 198, sessions: 15 },
]

const weeklyRevenue = [
  { day: 'จ.', revenue: 48200 },
  { day: 'อ.', revenue: 52800 },
  { day: 'พ.', revenue: 61400 },
  { day: 'พฤ.', revenue: 55300 },
  { day: 'ศ.', revenue: 72100 },
  { day: 'ส.', revenue: 89600 },
  { day: 'อา.', revenue: 84400 },
]

const statusMap: Record<string, { label: string; color: string }> = {
  online: { label: 'Online', color: '#10B981' },
  offline: { label: 'Offline', color: '#EF4444' },
  maintenance: { label: 'Maintenance', color: '#F5A623' },
}

export default function EVStationsPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedStation, setSelectedStation] = useState<typeof stations[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด')
  useEffect(() => setMounted(true), [])

  const totalPorts = stations.reduce((s, st) => s + st.ports, 0)
  const activePorts = stations.reduce((s, st) => s + st.activePorts, 0)
  const todayRevenue = stations.reduce((s, st) => s + st.todayRevenue, 0)
  const todayEnergy = stations.reduce((s, st) => s + st.todayEnergy, 0)
  const onlineCount = stations.filter(st => st.status === 'online').length

  const filtered = filterStatus === 'ทั้งหมด' ? stations : stations.filter(st => st.status === filterStatus)

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
            EV Station Monitor
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            จุดชาร์จ EV {stations.length} สถานี · {activePorts}/{totalPorts} ports ใช้งาน · อัพเดท 1 เม.ย. 2026, 09:30
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>{onlineCount}/{stations.length} Online</span>
          </div>
          <button style={{
            padding: '8px 16px', background: '#F5A623', border: 'none',
            borderRadius: 8, color: '#0A1628', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            + เพิ่มสถานี
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Ports ทั้งหมด', value: `${activePorts}/${totalPorts}`, sub: 'Active/Total', color: '#10B981' },
          { label: 'พลังงานวันนี้', value: `${todayEnergy.toFixed(0)} kWh`, sub: 'Energy Delivered Today', color: '#06B6D4' },
          { label: 'รายได้วันนี้', value: `฿${todayRevenue.toLocaleString()}`, sub: 'Revenue Today', color: '#F5A623' },
          { label: 'รายได้เดือนนี้', value: `฿${(stations.reduce((s, st) => s + st.monthRevenue, 0) / 1000).toFixed(0)}K`, sub: 'Month-to-Date', color: '#A855F7' },
        ].map((kpi, i) => (
          <div key={i} className="glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, marginBottom: 6 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: '#334155' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>การใช้พลังงานรายชั่วโมง (วันนี้)</h3>
          {mounted ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hourlyUsage} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}kW`} />
                <Tooltip
                  contentStyle={{ background: '#0F2040', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: unknown, name: unknown) => [String(v) + (name === 'kw' ? ' kW' : ' sessions'), name === 'kw' ? 'Power' : 'Sessions'] as [string, string]}
                />
                <Bar dataKey="kw" fill="#06B6D4" radius={[3, 3, 0, 0]} name="kw" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>กำลังโหลด...</div>}
        </div>

        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>รายได้รายวัน (สัปดาห์นี้)</h3>
          {mounted ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyRevenue} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `฿${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: '#0F2040', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: unknown) => [`฿${((v as number) / 1000).toFixed(1)}K`, 'รายได้'] as [string, string]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#F5A623" strokeWidth={2.5} dot={{ fill: '#F5A623', r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>กำลังโหลด...</div>}
        </div>
      </div>

      {/* Station List */}
      <div className="glass" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>รายการสถานี EV</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {['ทั้งหมด', 'online', 'offline', 'maintenance'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '5px 12px',
                background: filterStatus === s ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filterStatus === s ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 6, color: filterStatus === s ? '#F5A623' : '#64748B', fontSize: 11, cursor: 'pointer',
              }}>
                {s === 'ทั้งหมด' ? 'ทั้งหมด' : statusMap[s]?.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((st, i) => (
            <div key={st.id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 18px', background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10,
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
              onClick={() => setSelectedStation(st)}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}
            >
              {/* Status Dot */}
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: statusMap[st.status].color,
                  boxShadow: `0 0 8px ${statusMap[st.status].color}80`,
                }} />
              </div>

              {/* Station Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>{st.name}</span>
                  <span style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 4,
                    background: 'rgba(245,166,35,0.08)', color: '#F5A623',
                    border: '1px solid rgba(245,166,35,0.2)',
                  }}>{st.id}</span>
                </div>
                <div style={{ fontSize: 11, color: '#475569' }}>{st.location} · {st.type}</div>
              </div>

              {/* Ports */}
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: statusMap[st.status].color }}>{st.activePorts}/{st.ports}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>Ports Active</div>
              </div>

              {/* Power */}
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#06B6D4' }}>{st.powerOutput} kW</div>
                <div style={{ fontSize: 10, color: '#475569' }}>Current Output</div>
              </div>

              {/* Today Stats */}
              <div style={{ textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>{st.todayEnergy} kWh</div>
                <div style={{ fontSize: 11, color: '#F5A623' }}>฿{st.todayRevenue.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>วันนี้</div>
              </div>

              {/* Sessions */}
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#A855F7' }}>{st.sessions}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>Sessions</div>
              </div>

              {/* Last Seen */}
              <div style={{ fontSize: 10, color: '#334155', minWidth: 90, textAlign: 'right' }}>{st.lastSeen}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStation && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setSelectedStation(null)}>
          <div style={{
            background: '#0F1E35', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 16,
            padding: '28px 32px', width: 520, maxWidth: '90vw',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusMap[selectedStation.status].color, boxShadow: `0 0 8px ${statusMap[selectedStation.status].color}` }} />
                  <span style={{ fontSize: 10, color: statusMap[selectedStation.status].color, fontWeight: 600 }}>{statusMap[selectedStation.status].label}</span>
                  <span style={{ fontSize: 10, color: '#475569' }}>· {selectedStation.id}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#F1F5F9' }}>{selectedStation.name}</h2>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{selectedStation.location}</div>
              </div>
              <button onClick={() => setSelectedStation(null)} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, width: 28, height: 28, cursor: 'pointer', color: '#64748B', fontSize: 16,
              }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'ชนิด Charger', value: selectedStation.type, color: '#06B6D4' },
                { label: 'Ports', value: `${selectedStation.activePorts}/${selectedStation.ports} Active`, color: '#10B981' },
                { label: 'กำลังผลิตปัจจุบัน', value: `${selectedStation.powerOutput} kW`, color: '#F5A623' },
                { label: 'Sessions วันนี้', value: `${selectedStation.sessions}`, color: '#A855F7' },
                { label: 'พลังงานวันนี้', value: `${selectedStation.todayEnergy} kWh`, color: '#06B6D4' },
                { label: 'รายได้วันนี้', value: `฿${selectedStation.todayRevenue.toLocaleString()}`, color: '#10B981' },
                { label: 'รายได้เดือนนี้', value: `฿${selectedStation.monthRevenue.toLocaleString()}`, color: '#F5A623' },
                { label: 'อัพเดทล่าสุด', value: selectedStation.lastSeen, color: '#94A3B8' },
              ].map((row, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: row.color }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
