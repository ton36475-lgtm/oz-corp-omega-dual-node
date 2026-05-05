'use client'
import { useEffect, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const customers = [
  {
    id: 'C001',
    name: 'บริษัท ไทยเหล็กสยาม จำกัด',
    type: 'โรงงาน',
    location: 'นิคมอุตสาหกรรม บางปะอิน',
    kWp: 350,
    installDate: '15 ม.ค. 2025',
    status: 'ดำเนินการปกติ',
    statusColor: '#10B981',
    billBefore: 620000,
    billSaving: 248000,
    totalGenerated: 142500,
    systemValue: 12500000,
    pm: 'Kihei-26',
  },
  {
    id: 'C002',
    name: 'โรงแรม แกรนด์ รอยัล พิษณุโลก',
    type: 'โรงแรม',
    location: 'ถนนบรมไตรโลกนาถ พิษณุโลก',
    kWp: 150,
    installDate: '3 มี.ค. 2025',
    status: 'ดำเนินการปกติ',
    statusColor: '#10B981',
    billBefore: 320000,
    billSaving: 112000,
    totalGenerated: 58200,
    systemValue: 5400000,
    pm: 'Yasoemon-43',
  },
  {
    id: 'C003',
    name: 'ห้างสรรพสินค้า พิษณุโลก พลาซ่า',
    type: 'ห้างสรรพสินค้า',
    location: 'ถนนสิงหวัฒน์ พิษณุโลก',
    kWp: 250,
    installDate: '22 เม.ย. 2025',
    status: 'รอ O&M ประจำไตรมาส',
    statusColor: '#F5A623',
    billBefore: 480000,
    billSaving: 182000,
    totalGenerated: 78900,
    systemValue: 9200000,
    pm: 'Kihei-26',
  },
  {
    id: 'C004',
    name: 'โรงพยาบาล พิษณุโลก เมดิคอล',
    type: 'โรงพยาบาล',
    location: 'ถนนพุทธบูชา พิษณุโลก',
    kWp: 200,
    installDate: '10 มิ.ย. 2025',
    status: 'ดำเนินการปกติ',
    statusColor: '#10B981',
    billBefore: 390000,
    billSaving: 143000,
    totalGenerated: 52100,
    systemValue: 7100000,
    pm: 'Yasoemon-43',
  },
  {
    id: 'C005',
    name: 'บริษัท อาหารไทย เอ็กซ์พอร์ต จำกัด',
    type: 'โรงงาน',
    location: 'อำเภอบางระกำ พิษณุโลก',
    kWp: 500,
    installDate: '5 ส.ค. 2025',
    status: 'ดำเนินการปกติ',
    statusColor: '#10B981',
    billBefore: 850000,
    billSaving: 340000,
    totalGenerated: 98700,
    systemValue: 17500000,
    pm: 'Kihei-26',
  },
  {
    id: 'C006',
    name: 'บริษัท ล็อกซเล่ย์ โลจิสติกส์',
    type: 'โกดังสินค้า',
    location: 'นิคมอุตสาหกรรม พิษณุโลก',
    kWp: 420,
    installDate: '1 ต.ค. 2025',
    status: 'อยู่ระหว่างปรับแต่งระบบ',
    statusColor: '#06B6D4',
    billBefore: 710000,
    billSaving: 281000,
    totalGenerated: 67300,
    systemValue: 14800000,
    pm: 'Yasoemon-43',
  },
  {
    id: 'C007',
    name: 'มหาวิทยาลัยนเรศวร',
    type: 'สถาบันการศึกษา',
    location: 'ตำบลท่าโพธิ์ พิษณุโลก',
    kWp: 800,
    installDate: '20 ธ.ค. 2025',
    status: 'ดำเนินการปกติ',
    statusColor: '#10B981',
    billBefore: 1200000,
    billSaving: 468000,
    totalGenerated: 38500,
    systemValue: 28000000,
    pm: 'Kihei-26',
  },
  {
    id: 'C008',
    name: 'โรงงาน ไอยรา พลาสติก',
    type: 'โรงงาน',
    location: 'อำเภอวังทอง พิษณุโลก',
    kWp: 180,
    installDate: '10 มี.ค. 2026',
    status: 'อยู่ระหว่างติดตั้ง',
    statusColor: '#A855F7',
    billBefore: 340000,
    billSaving: 0,
    totalGenerated: 0,
    systemValue: 6300000,
    pm: 'Yasoemon-43',
  },
]

const savingTrend = [
  { month: 'ต.ค.', saving: 580000 },
  { month: 'พ.ย.', saving: 680000 },
  { month: 'ธ.ค.', saving: 780000 },
  { month: 'ม.ค.', saving: 1050000 },
  { month: 'ก.พ.', saving: 1240000 },
  { month: 'มี.ค.', saving: 1769000 },
]

const typeBreakdown = [
  { name: 'โรงงาน', value: 3, color: '#F5A623' },
  { name: 'โรงแรม', value: 1, color: '#06B6D4' },
  { name: 'โกดัง', value: 1, color: '#10B981' },
  { name: 'โรงพยาบาล', value: 1, color: '#A855F7' },
  { name: 'ห้างสรรพสินค้า', value: 1, color: '#EF4444' },
  { name: 'มหาวิทยาลัย', value: 1, color: '#3B82F6' },
]

export default function CustomersPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null)
  const [filterType, setFilterType] = useState('ทั้งหมด')
  useEffect(() => setMounted(true), [])

  const types = ['ทั้งหมด', 'โรงงาน', 'โรงแรม', 'โกดังสินค้า', 'โรงพยาบาล', 'ห้างสรรพสินค้า', 'สถาบันการศึกษา']
  const filtered = filterType === 'ทั้งหมด' ? customers : customers.filter(c => c.type === filterType)

  const totalKwp = customers.reduce((s, c) => s + c.kWp, 0)
  const totalSaving = customers.reduce((s, c) => s + c.billSaving, 0)
  const totalGenerated = customers.reduce((s, c) => s + c.totalGenerated, 0)
  const totalValue = customers.reduce((s, c) => s + c.systemValue, 0)

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
            Customer Management
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            ลูกค้าทั้งหมด {customers.length} ราย · กำลังติดตั้ง Solar {totalKwp.toLocaleString()} kWp
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            padding: '8px 16px', background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8,
            color: '#10B981', fontSize: 13, cursor: 'pointer',
          }}>
            ส่งออก Excel
          </button>
          <button style={{
            padding: '8px 16px', background: '#F5A623', border: 'none',
            borderRadius: 8, color: '#0A1628', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            + เพิ่มลูกค้าใหม่
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'ลูกค้าทั้งหมด', value: `${customers.length} ราย`, sub: '7 Active · 1 ติดตั้ง', color: '#F5A623' },
          { label: 'กำลังผลิตรวม', value: `${totalKwp.toLocaleString()} kWp`, sub: 'Solar Capacity', color: '#10B981' },
          { label: 'ประหยัดไฟ/เดือน', value: `฿${(totalSaving / 1000000).toFixed(2)}M`, sub: 'รวมทุกโปรเจค', color: '#06B6D4' },
          { label: 'มูลค่าโปรเจคทั้งหมด', value: `฿${(totalValue / 1000000).toFixed(0)}M`, sub: 'Portfolio Value', color: '#A855F7' },
        ].map((kpi, i) => (
          <div key={i} className="glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, marginBottom: 6, letterSpacing: '-0.5px' }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: '#334155' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="glass" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>ยอดประหยัดไฟสะสมรายเดือน</h3>
            <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>6 เดือนล่าสุด</span>
          </div>
          {mounted ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={savingTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `฿${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ background: '#0F2040', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: unknown) => [`฿${((v as number) / 1000).toFixed(0)}K`, 'ประหยัด'] as [string, string]}
                />
                <Bar dataKey="saving" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 12 }}>กำลังโหลด...</div>}
        </div>

        <div className="glass" style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>ประเภทลูกค้า</h3>
          {mounted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {typeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0F2040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                {typeBreakdown.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{t.name} ({t.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 12 }}>กำลังโหลด...</div>}
        </div>
      </div>

      {/* Filter + Table */}
      <div className="glass" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>รายชื่อลูกค้า</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilterType(t)} style={{
                padding: '5px 12px',
                background: filterType === t ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filterType === t ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 6, color: filterType === t ? '#F5A623' : '#64748B', fontSize: 11, cursor: 'pointer',
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['ID', 'ชื่อลูกค้า', 'ประเภท', 'ขนาดระบบ', 'วันติดตั้ง', 'ค่าไฟก่อน', 'ประหยัด/เดือน', 'พลังงานผลิต', 'สถานะ', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#475569', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px', fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{c.id}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#F1F5F9', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    <div>{c.name}</div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{c.location}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 8px', borderRadius: 4,
                      background: 'rgba(245,166,35,0.08)', color: '#F5A623',
                      border: '1px solid rgba(245,166,35,0.2)', whiteSpace: 'nowrap',
                    }}>{c.type}</span>
                  </td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#10B981', fontWeight: 600 }}>{c.kWp.toLocaleString()} kWp</td>
                  <td style={{ padding: '12px', fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>{c.installDate}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#94A3B8' }}>฿{(c.billBefore / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#10B981', fontWeight: 600 }}>
                    {c.billSaving > 0 ? `฿${(c.billSaving / 1000).toFixed(0)}K` : '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#06B6D4' }}>
                    {c.totalGenerated > 0 ? `${(c.totalGenerated / 1000).toFixed(1)} MWh` : '-'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 8px', borderRadius: 10,
                      background: `${c.statusColor}18`, color: c.statusColor,
                      border: `1px solid ${c.statusColor}38`, whiteSpace: 'nowrap',
                    }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => setSelectedCustomer(c)} style={{
                      padding: '5px 10px', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
                      color: '#94A3B8', fontSize: 11, cursor: 'pointer',
                    }}>ดูรายละเอียด</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setSelectedCustomer(null)}>
          <div style={{
            background: '#0F1E35', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 16,
            padding: '28px 32px', width: 520, maxWidth: '90vw',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, letterSpacing: '1px' }}>{selectedCustomer.id} · {selectedCustomer.type}</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#F1F5F9' }}>{selectedCustomer.name}</h2>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{selectedCustomer.location}</div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, width: 28, height: 28, cursor: 'pointer', color: '#64748B', fontSize: 16,
              }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'ขนาดระบบ', value: `${selectedCustomer.kWp.toLocaleString()} kWp`, color: '#10B981' },
                { label: 'วันติดตั้ง', value: selectedCustomer.installDate, color: '#F1F5F9' },
                { label: 'ค่าไฟก่อนติดตั้ง', value: `฿${(selectedCustomer.billBefore / 1000).toFixed(0)}K/เดือน`, color: '#EF4444' },
                { label: 'ประหยัด/เดือน', value: selectedCustomer.billSaving > 0 ? `฿${(selectedCustomer.billSaving / 1000).toFixed(0)}K` : 'รอข้อมูล', color: '#10B981' },
                { label: 'พลังงานผลิตสะสม', value: selectedCustomer.totalGenerated > 0 ? `${(selectedCustomer.totalGenerated / 1000).toFixed(1)} MWh` : '-', color: '#06B6D4' },
                { label: 'มูลค่าโปรเจค', value: `฿${(selectedCustomer.systemValue / 1000000).toFixed(1)}M`, color: '#F5A623' },
              ].map((row, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: row.color }}>{row.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: '#475569' }}>PM: <span style={{ color: '#A855F7' }}>{selectedCustomer.pm}</span></div>
              <span style={{
                fontSize: 12, padding: '4px 12px', borderRadius: 10,
                background: `${selectedCustomer.statusColor}18`, color: selectedCustomer.statusColor,
                border: `1px solid ${selectedCustomer.statusColor}38`,
              }}>{selectedCustomer.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
