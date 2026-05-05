'use client'
import { useEffect, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const monthlyRevenue = [
  { month: 'ต.ค.', revenue: 1800000, leads: 38 },
  { month: 'พ.ย.', revenue: 2100000, leads: 42 },
  { month: 'ธ.ค.', revenue: 2400000, leads: 35 },
  { month: 'ม.ค.', revenue: 2900000, leads: 51 },
  { month: 'ก.พ.', revenue: 3100000, leads: 48 },
  { month: 'มี.ค.', revenue: 3200000, leads: 54 },
]

const recentActivity = [
  { time: '2 นาทีที่แล้ว', text: 'Lead ใหม่: บริษัท ไทยเหล็กสยาม (200 kWp, ฿450K/เดือน)', type: 'lead', agent: 'Kuranosuke-01' },
  { time: '15 นาทีที่แล้ว', text: 'ส่งใบเสนอราคา: โรงงาน ABC Industries มูลค่า ฿8.5M', type: 'proposal', agent: 'Kihei-26' },
  { time: '32 นาทีที่แล้ว', text: 'ปิดการขาย: โรงแรม Grand Royal Bangkok (150 kWp)', type: 'won', agent: 'Gengo-35' },
  { time: '1 ชั่วโมงที่แล้ว', text: 'วิเคราะห์ข้อมูล: นิคมอุตสาหกรรม XYZ ค่าไฟ ฿620K/เดือน', type: 'analysis', agent: 'Jūnai-17' },
  { time: '2 ชั่วโมงที่แล้ว', text: 'สแกน Facebook Group พบ 14 leads ที่น่าสนใจ', type: 'scan', agent: "Kin'emon-16" },
  { time: '3 ชั่วโมงที่แล้ว', text: 'อัปเดตราคาไฟฟ้า PEA/MEA รอบ เม.ย. 2026', type: 'update', agent: 'Kin\'emon-03' },
]

const agentLayers = [
  { layer: 'L1 Perception', total: 16, online: 15 },
  { layer: 'L2 Analysis', total: 9, online: 8 },
  { layer: 'L3 Decision', total: 10, online: 9 },
  { layer: 'L4 Coordination', total: 8, online: 7 },
  { layer: 'L5 Research', total: 4, online: 3 },
]

const kpis = [
  { label: 'Total Leads', value: '127', change: '+18%', positive: true, sub: 'เดือนนี้' },
  { label: 'รายได้เดือนนี้', value: '฿3.2M', change: '+12%', positive: true, sub: 'vs เดือนที่แล้ว' },
  { label: 'Active Projects', value: '8', change: '+2', positive: true, sub: 'โปรเจกต์ที่ดำเนินอยู่' },
  { label: 'Conversion Rate', value: '24.3%', change: '+3.2%', positive: true, sub: 'lead → ปิดการขาย' },
]

const activityColor: Record<string, string> = {
  lead: '#F5A623',
  proposal: '#06B6D4',
  won: '#10B981',
  analysis: '#A855F7',
  scan: '#3B82F6',
  update: '#64748B',
}

const quickActions = [
  { label: '+ เพิ่ม Lead ใหม่', color: '#F5A623', href: '/leads' },
  { label: '🧮 คำนวณ ROI', color: '#10B981', href: '/calculator' },
  { label: '📊 ดูรายงานเต็ม', color: '#06B6D4', href: '/reports' },
  { label: '⚔ Agent Command Center', color: '#A855F7', href: '/agents' },
  { label: '🦞 OpenClaw Terminal', color: '#94A3B8', href: '/openclaw' },
]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const totalOnline = agentLayers.reduce((s, l) => s + l.online, 0)
  const totalAgents = agentLayers.reduce((s, l) => s + l.total, 0)

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
            CEO WarRoom
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            ภาพรวมธุรกิจแบบเรียลไทม์ · อัปเดตล่าสุด: 1 เมษายน 2026, 09:32
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/leads" style={{
            padding: '8px 16px', background: 'rgba(245,166,35,0.08)',
            border: '1px solid rgba(245,166,35,0.25)', borderRadius: 8,
            color: '#F5A623', fontSize: 13, textDecoration: 'none', display: 'inline-block',
          }}>
            + เพิ่ม Lead
          </a>
          <a href="/reports" style={{
            padding: '8px 16px', background: '#F5A623', border: 'none',
            borderRadius: 8, color: '#0A1628', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', display: 'inline-block',
          }}>
            ออกรายงาน
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#F1F5F9', marginBottom: 6, letterSpacing: '-0.5px' }}>
              {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: kpi.positive ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                {kpi.positive ? '↑' : '↓'} {kpi.change}
              </span>
              <span style={{ fontSize: 11, color: '#334155' }}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Revenue Chart */}
        <div className="glass" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>รายได้รายเดือน</h3>
            <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
              6 เดือนล่าสุด
            </span>
          </div>
          {mounted ? (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={monthlyRevenue} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `฿${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{ background: '#0F2040', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: unknown) => [`฿${((v as number) / 1000000).toFixed(2)}M`, 'รายได้'] as [string, string]}
                />
                <Line
                  type="monotone" dataKey="revenue"
                  stroke="#F5A623" strokeWidth={2.5}
                  dot={{ fill: '#F5A623', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#F5A623' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 12 }}>
              กำลังโหลดกราฟ...
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="glass" style={{ padding: '20px 22px', overflow: 'hidden' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>กิจกรรมล่าสุด</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                  background: activityColor[item.type] || '#64748B',
                  boxShadow: `0 0 6px ${activityColor[item.type] || '#64748B'}60`,
                }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5, wordBreak: 'break-word' }}>{item.text}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{item.time} · {item.agent}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Leads bar chart + Agent status + Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Leads chart */}
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Leads รายเดือน</h3>
          {mounted ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0F2040', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: unknown) => [String(v), 'Leads'] as [string, string]}
                />
                <Bar dataKey="leads" fill="#10B981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 12 }}>
              กำลังโหลด...
            </div>
          )}
        </div>

        {/* Agent Status */}
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>สถานะ 47 Ronin</h3>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#10B981' }}>{totalOnline}</div>
              <div style={{ fontSize: 10, color: '#64748B' }}>Online</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#F5A623' }}>4</div>
              <div style={{ fontSize: 10, color: '#64748B' }}>Busy</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#475569' }}>{totalAgents - totalOnline}</div>
              <div style={{ fontSize: 10, color: '#64748B' }}>Offline</div>
            </div>
          </div>
          {agentLayers.map((layer, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{layer.layer}</span>
                <span style={{ fontSize: 11, color: '#475569' }}>{layer.online}/{layer.total}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <div style={{
                  height: '100%',
                  width: `${(layer.online / layer.total) * 100}%`,
                  background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                  borderRadius: 2,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickActions.map(({ label, color, href }) => (
              <a key={href} href={href} style={{
                display: 'block',
                padding: '9px 14px',
                background: `${color}12`,
                border: `1px solid ${color}28`,
                borderRadius: 8,
                color,
                fontSize: 13,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
