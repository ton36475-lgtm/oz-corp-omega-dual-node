'use client'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

const monthlyData = [
  { month: 'ต.ค.', revenue: 1800000, target: 2000000, leads: 38, closed: 7 },
  { month: 'พ.ย.', revenue: 2100000, target: 2000000, leads: 42, closed: 9 },
  { month: 'ธ.ค.', revenue: 2400000, target: 2500000, leads: 35, closed: 8 },
  { month: 'ม.ค.', revenue: 2900000, target: 2500000, leads: 51, closed: 12 },
  { month: 'ก.พ.', revenue: 3100000, target: 3000000, leads: 48, closed: 11 },
  { month: 'มี.ค.', revenue: 3200000, target: 3000000, leads: 54, closed: 13 },
]

const funnelData = [
  { stage: 'Leads ทั้งหมด', count: 127, color: '#60A5FA' },
  { stage: 'ติดต่อแล้ว', count: 98, color: '#06B6D4' },
  { stage: 'คัดกรองแล้ว', count: 64, color: '#A855F7' },
  { stage: 'ส่งใบเสนอราคา', count: 38, color: '#F5A623' },
  { stage: 'ปิดการขาย', count: 13, color: '#10B981' },
]

const sourceData = [
  { name: 'Facebook', value: 42, color: '#3B82F6' },
  { name: 'Google Ads', value: 28, color: '#F5A623' },
  { name: 'Referral', value: 24, color: '#10B981' },
  { name: 'Direct', value: 18, color: '#A855F7' },
  { name: 'Line OA', value: 10, color: '#06B6D4' },
  { name: 'อื่นๆ', value: 5, color: '#64748B' },
]

const topAgents = [
  { name: 'Gengo-35 (Orchestrator)', deals: 18, revenue: 12400000, rate: '71%' },
  { name: 'Kihei-26 (Proposal)', deals: 15, revenue: 10200000, rate: '65%' },
  { name: 'Kuranosuke-01 (Perception)', deals: 13, revenue: 8900000, rate: '58%' },
  { name: 'Jūnai-17 (Analysis)', deals: 11, revenue: 7600000, rate: '52%' },
  { name: 'Mimura-44 (Research)', deals: 8, revenue: 5500000, rate: '44%' },
]

const summaryCards = [
  { label: 'รายได้รวม Q1/2026', value: '฿9.2M', change: '+18%', color: '#F5A623' },
  { label: 'Leads ใหม่เดือนนี้', value: '54', change: '+12%', color: '#10B981' },
  { label: 'อัตราปิดการขาย', value: '24.3%', change: '+3.2%', color: '#06B6D4' },
  { label: 'ค่าเฉลี่ยต่อดีล', value: '฿248K', change: '+6%', color: '#A855F7' },
]

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
            Analytics & Reports
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            รายงานยอดขายและประสิทธิภาพ · Q1/2026
          </p>
        </div>
        <button style={{
          padding: '9px 20px', background: 'rgba(245,166,35,0.08)',
          border: '1px solid rgba(245,166,35,0.25)', borderRadius: 8,
          color: '#F5A623', fontSize: 13, cursor: 'pointer',
        }}>
          ⬇ ส่งออก PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {summaryCards.map((c, i) => (
          <div key={i} className="glass" style={{ padding: '18px 20px', borderTop: `2px solid ${c.color}40` }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#10B981' }}>↑ {c.change} vs เดือนที่แล้ว</div>
          </div>
        ))}
      </div>

      {/* Revenue vs Target + Source Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Revenue vs Target */}
        <div className="glass" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>รายได้ vs เป้าหมาย</h3>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#F5A623' }} />
                <span style={{ fontSize: 11, color: '#64748B' }}>รายได้จริง</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
                <span style={{ fontSize: 11, color: '#64748B' }}>เป้าหมาย</span>
              </div>
            </div>
          </div>
          {mounted ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `฿${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{ background: '#0F2040', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: unknown, name: unknown) => [
                    `฿${((v as number) / 1000000).toFixed(2)}M`,
                    name === 'revenue' ? 'รายได้จริง' : 'เป้าหมาย',
                  ] as [string, string]}
                />
                <Bar dataKey="target" fill="rgba(255,255,255,0.06)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="revenue" fill="#F5A623" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 220 }} />}
        </div>

        {/* Source Pie */}
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>แหล่งที่มา Leads</h3>
          {mounted ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={sourceData} cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65}
                    paddingAngle={2} dataKey="value"
                  >
                    {sourceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0F2040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: unknown) => [`${v} leads`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 4 }}>
                {sourceData.map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div style={{ height: 200 }} />}
        </div>
      </div>

      {/* Conversion Funnel + Leads trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Conversion Funnel */}
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Sales Funnel</h3>
          {funnelData.map((item, i) => {
            const pct = Math.round((item.count / funnelData[0].count) * 100)
            const convRate = i > 0
              ? Math.round((item.count / funnelData[i - 1].count) * 100) + '%'
              : '100%'
            return (
              <div key={item.stage} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>{item.stage}</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#475569' }}>conv: {convRate}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.count}</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: item.color, borderRadius: 3,
                    transition: 'width 0.6s ease',
                    boxShadow: `0 0 8px ${item.color}40`,
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Leads trend */}
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Leads & ดีลที่ปิด</h3>
          {mounted ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0F2040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: unknown, name: unknown) => [String(v), name === 'leads' ? 'Leads' : 'ปิดการขาย'] as [string, string]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#64748B' }}
                  formatter={(v: string) => v === 'leads' ? 'Leads ใหม่' : 'ปิดการขาย'}
                />
                <Line type="monotone" dataKey="leads" stroke="#60A5FA" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="closed" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 200 }} />}
        </div>
      </div>

      {/* Top Agents Table */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Top Performing Agents</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['#', 'Agent', 'ดีลที่ปิด', 'รายได้รวม', 'Conversion Rate'].map(h => (
                <th key={h} style={{
                  padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                  color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topAgents.map((agent, i) => (
              <tr key={agent.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '13px 20px', color: '#475569', fontSize: 13 }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </td>
                <td style={{ padding: '13px 20px', fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{agent.name}</td>
                <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 700, color: '#10B981' }}>{agent.deals}</td>
                <td style={{ padding: '13px 20px', fontSize: 13, color: '#F5A623', fontWeight: 600 }}>
                  ฿{(agent.revenue / 1000000).toFixed(1)}M
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <div style={{
                        height: '100%', width: agent.rate,
                        background: 'linear-gradient(90deg, #10B981, #06B6D4)', borderRadius: 2,
                      }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600, width: 36 }}>{agent.rate}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
