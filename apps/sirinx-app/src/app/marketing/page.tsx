'use client'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const socialStats = [
  { platform: 'Facebook Page', followers: 12400, reach: 48200, engagement: 5.8, color: '#3B82F6', icon: '📘' },
  { platform: 'Facebook Group', followers: 3800, reach: 21000, engagement: 12.4, color: '#06B6D4', icon: '👥' },
  { platform: 'Instagram', followers: 2900, reach: 14500, engagement: 7.2, color: '#A855F7', icon: '📸' },
  { platform: 'LINE OA', followers: 8600, reach: 31000, engagement: 9.1, color: '#10B981', icon: '💬' },
]

const contentPipeline = [
  { title: 'อินโฟกราฟิก: ประหยัดค่าไฟด้วยโซลาร์ในพิษณุโลก', type: 'Infographic', status: 'เผยแพร่แล้ว', date: '28 มี.ค. 2026', reach: 12400, leads: 8, agent: 'Content-Pipeline' },
  { title: 'วิดีโอ: ขั้นตอนการติดตั้ง Solar EPC 5 ขั้นตอน', type: 'Video', status: 'กำลังผลิต', date: '2 เม.ย. 2026', reach: 0, leads: 0, agent: 'Content-Pipeline' },
  { title: 'โพสต์: Case Study โรงงานไทยเหล็กสยาม ประหยัด 40%', type: 'Post', status: 'รอนำเสนอ', date: '5 เม.ย. 2026', reach: 0, leads: 0, agent: 'Kuranosuke-01' },
  { title: 'บทความ: ROI Solar ภาคอุตสาหกรรม 2026', type: 'Article', status: 'เผยแพร่แล้ว', date: '25 มี.ค. 2026', reach: 8900, leads: 12, agent: 'Content-Pipeline' },
  { title: 'Reel: ก่อน-หลัง ติดตั้ง Solar โรงแรม 150 kWp', type: 'Reel', status: 'เผยแพร่แล้ว', date: '20 มี.ค. 2026', reach: 34200, leads: 5, agent: 'Content-Pipeline' },
  { title: 'อีเมล: Newsletter Solar Trend Q2/2026', type: 'Email', status: 'กำลังผลิต', date: '7 เม.ย. 2026', reach: 0, leads: 0, agent: 'CMO-Marketing' },
]

const campaigns = [
  { name: 'Solar Factory Campaign Q2', budget: 150000, spent: 87000, leads: 34, cpl: 2559, status: 'กำลังดำเนินการ', color: '#10B981' },
  { name: 'Hotel & Hospitality Solar', budget: 80000, spent: 80000, leads: 18, cpl: 4444, status: 'สิ้นสุดแล้ว', color: '#64748B' },
  { name: 'โรงพยาบาล & คลินิก', budget: 60000, spent: 12000, leads: 6, cpl: 2000, status: 'เริ่มใหม่', color: '#F5A623' },
  { name: 'Facebook Group Scanning', budget: 20000, spent: 20000, leads: 47, cpl: 426, status: 'สิ้นสุดแล้ว', color: '#A855F7' },
]

const leadSources = [
  { name: 'Facebook Ads', value: 38, color: '#3B82F6' },
  { name: 'Facebook Group', value: 24, color: '#06B6D4' },
  { name: 'Referral', value: 18, color: '#10B981' },
  { name: 'LINE OA', value: 12, color: '#A855F7' },
  { name: 'Google SEO', value: 8, color: '#F5A623' },
]

const monthlyLeads = [
  { month: 'ต.ค.', organic: 18, paid: 20 },
  { month: 'พ.ย.', organic: 22, paid: 20 },
  { month: 'ธ.ค.', organic: 15, paid: 20 },
  { month: 'ม.ค.', organic: 25, paid: 26 },
  { month: 'ก.พ.', organic: 28, paid: 20 },
  { month: 'มี.ค.', organic: 32, paid: 22 },
]

const statusColor: Record<string, string> = {
  'เผยแพร่แล้ว': '#10B981',
  'กำลังผลิต': '#F5A623',
  'รอนำเสนอ': '#06B6D4',
}

export default function MarketingPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'campaigns'>('overview')
  useEffect(() => setMounted(true), [])

  const totalFollowers = socialStats.reduce((s, p) => s + p.followers, 0)
  const totalReach = socialStats.reduce((s, p) => s + p.reach, 0)
  const totalCampaignLeads = campaigns.reduce((s, c) => s + c.leads, 0)
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0)

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
            Marketing Dashboard
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            Social Media · Content Pipeline · Campaign Performance · พิษณุโลก
          </p>
        </div>
        <button style={{
          padding: '8px 18px', background: '#F5A623', border: 'none',
          borderRadius: 8, color: '#0A1628', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>
          + สร้าง Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Followers รวม', value: `${(totalFollowers / 1000).toFixed(1)}K`, change: '+8.4%', color: '#3B82F6' },
          { label: 'Reach/เดือน', value: `${(totalReach / 1000).toFixed(0)}K`, change: '+15.2%', color: '#06B6D4' },
          { label: 'Leads จาก Campaign', value: `${totalCampaignLeads}`, change: '+22%', color: '#10B981' },
          { label: 'Ad Spend/เดือน', value: `฿${(totalSpent / 1000).toFixed(0)}K`, change: '-', color: '#F5A623' },
        ].map((kpi, i) => (
          <div key={i} className="glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, marginBottom: 6 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: '#10B981' }}>↑ {kpi.change} vs เดือนที่แล้ว</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['overview', 'content', 'campaigns'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 18px',
            background: activeTab === tab ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${activeTab === tab ? 'rgba(245,166,35,0.35)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, color: activeTab === tab ? '#F5A623' : '#64748B',
            fontSize: 13, cursor: 'pointer', fontWeight: activeTab === tab ? 600 : 400,
          }}>
            {tab === 'overview' ? 'ภาพรวม' : tab === 'content' ? 'Content Pipeline' : 'Campaigns'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Social Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
            {socialStats.map((s, i) => (
              <div key={i} className="glass" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>{s.platform}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 9, color: '#475569', marginBottom: 2 }}>FOLLOWERS</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.followers.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 9, color: '#475569' }}>Reach</div>
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>{(s.reach / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: '#475569' }}>Engagement</div>
                    <div style={{ fontSize: 13, color: '#10B981' }}>{s.engagement}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16 }}>
            <div className="glass" style={{ padding: '20px 22px' }}>
              <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Leads: Organic vs Paid</h3>
              {mounted ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyLeads} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0F2040', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="organic" name="Organic" fill="#10B981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="paid" name="Paid" fill="#F5A623" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>กำลังโหลด...</div>}
            </div>

            <div className="glass" style={{ padding: '20px 22px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>แหล่งที่มา Lead</h3>
              {mounted ? (
                <>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={leadSources} cx="50%" cy="50%" outerRadius={55} dataKey="value" paddingAngle={3}>
                        {leadSources.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0F2040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`${v}%`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {leadSources.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.name}</span>
                        </div>
                        <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>กำลังโหลด...</div>}
            </div>
          </div>
        </>
      )}

      {activeTab === 'content' && (
        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>Content Pipeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contentPipeline.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 16px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap',
                  background: 'rgba(245,166,35,0.08)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)',
                }}>{item.type}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{item.date} · {item.agent}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.reach > 0 ? `${(item.reach / 1000).toFixed(1)}K reach` : '-'}</div>
                  <div style={{ fontSize: 11, color: '#10B981' }}>{item.leads > 0 ? `${item.leads} leads` : ''}</div>
                </div>
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap',
                  background: `${statusColor[item.status] || '#64748B'}18`,
                  color: statusColor[item.status] || '#64748B',
                  border: `1px solid ${statusColor[item.status] || '#64748B'}38`,
                }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {campaigns.map((c, i) => (
            <div key={i} className="glass" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#F1F5F9' }}>{c.name}</h3>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 10,
                    background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}38`,
                  }}>{c.status}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#475569' }}>Budget</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#F1F5F9' }}>฿{c.budget.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
                {[
                  { label: 'Spent', value: `฿${c.spent.toLocaleString()}`, color: '#EF4444' },
                  { label: 'Remaining', value: `฿${(c.budget - c.spent).toLocaleString()}`, color: '#10B981' },
                  { label: 'Leads', value: `${c.leads}`, color: '#06B6D4' },
                  { label: 'CPL', value: `฿${c.cpl.toLocaleString()}`, color: '#F5A623' },
                ].map((m, j) => (
                  <div key={j} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${(c.spent / c.budget) * 100}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`, borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#475569' }}>ใช้งบ {((c.spent / c.budget) * 100).toFixed(0)}%</span>
                <span style={{ fontSize: 11, color: '#475569' }}>เหลือ ฿{(c.budget - c.spent).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
