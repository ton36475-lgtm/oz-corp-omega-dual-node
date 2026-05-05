'use client'
import { useState, useEffect } from 'react'
import { getLeads, createLead } from '@/services/leads'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { Lead as DBLead, LeadStatus } from '@/lib/database.types'

// Page-level display type (superset of DB Lead — adds UI-only fields)
interface Lead extends DBLead {
  kwp?: number
  bill?: number
}

// Static mock used when Supabase is not configured
const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'คุณสมชาย ใจดี', company: 'บริษัท ไทยเหล็กสยาม จำกัด', phone: '081-234-5678', email: null, kwp: 200, source: 'Facebook', status: 'new', assigned_agent: 'Kuranosuke-01', score: 80, notes: null, created_at: '2026-04-01', updated_at: '2026-04-01', province: 'ชลบุรี', bill: 450000 },
  { id: '2', name: 'คุณสุภาพร รักไทย', company: 'โรงแรม Grand Royal Bangkok', phone: '082-345-6789', email: null, kwp: 150, source: 'Line OA', status: 'proposal', assigned_agent: 'Kihei-26', score: 90, notes: null, created_at: '2026-03-28', updated_at: '2026-03-28', province: 'กรุงเทพ', bill: 320000 },
  { id: '3', name: 'คุณประยุทธ์ มั่นคง', company: 'นิคมอุตสาหกรรม ABC', phone: '083-456-7890', email: null, kwp: 500, source: 'Google Ads', status: 'won', assigned_agent: 'Gengo-35', score: 95, notes: null, created_at: '2026-03-20', updated_at: '2026-03-20', province: 'ระยอง', bill: 950000 },
  { id: '4', name: 'คุณวิมล สุขใส', company: 'โรงงานน้ำตาลไทย', phone: '084-567-8901', email: null, kwp: 300, source: 'Referral', status: 'qualified', assigned_agent: 'Jūnai-17', score: 85, notes: null, created_at: '2026-03-25', updated_at: '2026-03-25', province: 'ขอนแก่น', bill: 680000 },
  { id: '5', name: 'คุณอัมพร ดีงาม', company: 'ห้างสรรพสินค้า Future Park', phone: '085-678-9012', email: null, kwp: 250, source: 'Facebook', status: 'contacted', assigned_agent: 'Kuranosuke-01', score: 70, notes: null, created_at: '2026-03-30', updated_at: '2026-03-30', province: 'ปทุมธานี', bill: 520000 },
  { id: '6', name: 'คุณธนา ศรีสุข', company: 'บริษัท สยามพาณิชย์ จำกัด', phone: '086-789-0123', email: null, kwp: 100, source: 'TikTok', status: 'new', assigned_agent: 'Kuranosuke-01', score: 60, notes: null, created_at: '2026-04-01', updated_at: '2026-04-01', province: 'กรุงเทพ', bill: 210000 },
  { id: '7', name: 'คุณอรวรรณ กิตติ', company: 'โรงพยาบาล Bangkok General', phone: '087-890-1234', email: null, kwp: 180, source: 'Google Ads', status: 'proposal', assigned_agent: 'Kihei-26', score: 88, notes: null, created_at: '2026-03-22', updated_at: '2026-03-22', province: 'กรุงเทพ', bill: 380000 },
  { id: '8', name: 'คุณเกียรติศักดิ์ วงษ์', company: 'โรงงานฟาร์มา Plus', phone: '088-901-2345', email: null, kwp: 400, source: 'Referral', status: 'won', assigned_agent: 'Gengo-35', score: 97, notes: null, created_at: '2026-03-10', updated_at: '2026-03-10', province: 'นครปฐม', bill: 820000 },
  { id: '9', name: 'คุณนิรันดร์ ทองคำ', company: 'ศูนย์การค้า Central', phone: '089-012-3456', email: null, kwp: 600, source: 'Direct', status: 'qualified', assigned_agent: 'Jūnai-17', score: 92, notes: null, created_at: '2026-03-18', updated_at: '2026-03-18', province: 'เชียงใหม่', bill: 1200000 },
  { id: '10', name: 'คุณพรรณี ชัยโย', company: 'Logistics Hub Thailand', phone: '090-123-4567', email: null, kwp: 350, source: 'LinkedIn', status: 'contacted', assigned_agent: 'Kuranosuke-01', score: 75, notes: null, created_at: '2026-03-29', updated_at: '2026-03-29', province: 'สมุทรปราการ', bill: 720000 },
  { id: '11', name: 'คุณรัชดา อำนวยพร', company: 'โรงงาน Agri Fresh', phone: '091-234-5678', email: null, kwp: 80, source: 'Facebook', status: 'lost', assigned_agent: 'Jūnai-17', score: 30, notes: null, created_at: '2026-03-05', updated_at: '2026-03-05', province: 'ลพบุรี', bill: 160000 },
  { id: '12', name: 'คุณสายัณห์ แสนดี', company: 'บริษัท Cold Storage Pro', phone: '092-345-6789', email: null, kwp: 220, source: 'Google Ads', status: 'new', assigned_agent: 'Kuranosuke-01', score: 78, notes: null, created_at: '2026-04-01', updated_at: '2026-04-01', province: 'สมุทรสาคร', bill: 470000 },
  { id: '13', name: 'คุณอุดม พัฒนกุล', company: 'Hotel Pullman Phuket', phone: '093-456-7890', email: null, kwp: 280, source: 'Direct', status: 'proposal', assigned_agent: 'Kihei-26', score: 86, notes: null, created_at: '2026-03-26', updated_at: '2026-03-26', province: 'ภูเก็ต', bill: 580000 },
  { id: '14', name: 'คุณเยาวลักษณ์ ทวี', company: 'โรงงานสิ่งทอนาคม', phone: '094-567-8901', email: null, kwp: 170, source: 'Referral', status: 'qualified', assigned_agent: 'Jūnai-17', score: 83, notes: null, created_at: '2026-03-23', updated_at: '2026-03-23', province: 'นครราชสีมา', bill: 340000 },
  { id: '15', name: 'คุณจรัส ภูมิใจ', company: 'Warehouse Center East', phone: '095-678-9012', email: null, kwp: 450, source: 'Facebook', status: 'contacted', assigned_agent: 'Kuranosuke-01', score: 77, notes: null, created_at: '2026-03-31', updated_at: '2026-03-31', province: 'ฉะเชิงเทรา', bill: 900000 },
]

const statusConfig: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: 'ใหม่',          color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  contacted: { label: 'ติดต่อแล้ว',   color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
  qualified: { label: 'คัดกรองแล้ว',  color: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
  proposal:  { label: 'ใบเสนอราคา',  color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
  won:       { label: 'ปิดการขาย',    color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  lost:      { label: 'ไม่สำเร็จ',   color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
}

const statusOrder: (LeadStatus | 'all')[] = ['all', 'new', 'contacted', 'qualified', 'proposal', 'won', 'lost']

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = statusConfig[status]
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}30`,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}

export default function LeadsPage() {
  const [activeStatus, setActiveStatus] = useState<LeadStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [loadingLeads, setLoadingLeads] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    setLoadingLeads(true)
    getLeads().then(data => setLeads(data as Lead[])).catch(() => setLeads(MOCK_LEADS)).finally(() => setLoadingLeads(false))
  }, [])

  const filtered = leads.filter(l => {
    if (activeStatus !== 'all' && l.status !== activeStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        l.name.toLowerCase().includes(q) ||
        (l.company ?? '').toLowerCase().includes(q) ||
        (l.phone ?? '').includes(q) ||
        (l.province ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const counts: Record<string, number> = { all: leads.length }
  for (const s of Object.keys(statusConfig) as LeadStatus[]) {
    counts[s] = leads.filter(l => l.status === s).length
  }

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>Lead Management</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            จัดการ Leads ทั้งหมด · {leads.length} รายการ
            {' '}<span style={{ fontSize: 11, color: isSupabaseConfigured ? '#10B981' : '#475569' }}>
              {isSupabaseConfigured ? '● Supabase' : '● Mock data'}
            </span>
          </p>
        </div>
        <button style={{
          padding: '9px 20px', background: '#F5A623', border: 'none',
          borderRadius: 8, color: '#0A1628', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>
          + เพิ่ม Lead ใหม่
        </button>
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Status tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
          {statusOrder.map(s => {
            const active = activeStatus === s
            const label = s === 'all' ? 'ทั้งหมด' : statusConfig[s as LeadStatus].label
            return (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                style={{
                  padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  background: active ? 'rgba(245,166,35,0.15)' : 'transparent',
                  color: active ? '#F5A623' : '#64748B',
                  transition: 'all 0.15s',
                }}
              >
                {label} <span style={{ fontSize: 10, opacity: 0.7 }}>({counts[s]})</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}
            width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="ค้นหา ชื่อ, บริษัท, เบอร์..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: '#E2E8F0', fontSize: 13, outline: 'none', width: 240,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['ชื่อ / บริษัท', 'เบอร์โทร', 'kWp', 'ค่าไฟ/เดือน', 'จังหวัด', 'แหล่งที่มา', 'สถานะ', 'Agent'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                  color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: '#475569', fontSize: 14 }}>
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              filtered.map((lead, i) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,166,35,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}
                >
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{lead.name}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{lead.company}</div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#94A3B8' }}>{lead.phone ?? '—'}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#F5A623', fontWeight: 600 }}>{lead.kwp != null ? `${lead.kwp} kWp` : '—'}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#94A3B8' }}>{lead.bill != null ? `฿${lead.bill.toLocaleString()}` : '—'}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#94A3B8' }}>{lead.province ?? '—'}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748B' }}>{lead.source ?? '—'}</td>
                  <td style={{ padding: '13px 16px' }}><StatusBadge status={lead.status} /></td>
                  <td style={{ padding: '13px 16px', fontSize: 11, color: '#475569' }}>{lead.assigned_agent ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Modal */}
      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelected(null)}
        >
          <div
            className="glass"
            style={{ width: 480, padding: 28, borderRadius: 16, border: '1px solid rgba(245,166,35,0.2)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6, color: '#94A3B8', cursor: 'pointer', width: 28, height: 28, fontSize: 16 }}
            >
              ×
            </button>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  👤
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>{selected.company}</div>
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'เบอร์โทร', value: selected.phone ?? '—' },
                { label: 'จังหวัด', value: selected.province ?? '—' },
                { label: 'ขนาดระบบ', value: selected.kwp != null ? `${selected.kwp} kWp` : '—' },
                { label: 'ค่าไฟ/เดือน', value: selected.bill != null ? `฿${selected.bill.toLocaleString()}` : '—' },
                { label: 'แหล่งที่มา', value: selected.source ?? '—' },
                { label: 'Agent ที่รับผิดชอบ', value: selected.assigned_agent ?? '—' },
                { label: 'วันที่เพิ่ม', value: selected.created_at?.slice(0, 10) ?? '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 14, color: '#E2E8F0', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
              <button style={{
                flex: 1, padding: '9px 0', background: 'rgba(245,166,35,0.1)',
                border: '1px solid rgba(245,166,35,0.3)', borderRadius: 8,
                color: '#F5A623', fontSize: 13, cursor: 'pointer', fontWeight: 600,
              }}>
                คำนวณ ROI
              </button>
              <button style={{
                flex: 1, padding: '9px 0', background: '#F5A623',
                border: 'none', borderRadius: 8,
                color: '#0A1628', fontSize: 13, cursor: 'pointer', fontWeight: 700,
              }}>
                สร้างใบเสนอราคา
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
