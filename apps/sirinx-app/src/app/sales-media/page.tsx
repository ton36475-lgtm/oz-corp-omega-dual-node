'use client'
import { useState } from 'react'

type MediaItem = {
  id: string
  title: string
  titleEn: string
  type: 'Infographic' | 'Proposal' | 'Image Gem' | 'Brochure'
  category: string
  description: string
  size: string
  created: string
  agent: string
  tags: string[]
  color: string
  icon: string
  downloads: number
  views: number
  stats?: { label: string; value: string }[]
}

const mediaItems: MediaItem[] = [
  {
    id: 'INF-001',
    title: 'ประหยัดค่าไฟด้วยโซลาร์เซลล์ — B2B พิษณุโลก',
    titleEn: 'Solar Savings Infographic',
    type: 'Infographic',
    category: 'Solar Education',
    description: 'อินโฟกราฟิกอธิบายการประหยัดค่าไฟฟ้าด้วยระบบ Solar EPC สำหรับโรงงาน/ห้าง/โรงแรม ในพิษณุโลก พร้อม ROI calculation และ payback period',
    size: '1080×1920 px',
    created: '28 มี.ค. 2026',
    agent: 'Content-Pipeline',
    tags: ['Solar', 'ROI', 'B2B', 'ประหยัดค่าไฟ'],
    color: '#F5A623',
    icon: '☀️',
    downloads: 284,
    views: 4820,
    stats: [
      { label: 'ประหยัดค่าไฟ', value: 'สูงถึง 40%' },
      { label: 'Payback Period', value: '5-7 ปี' },
      { label: 'IRR', value: '18-24%' },
      { label: 'Lifetime', value: '25 ปี' },
    ],
  },
  {
    id: 'INF-002',
    title: 'ขั้นตอน EPC Solar 5 Step — B2B Process',
    titleEn: '5-Step EPC Process Infographic',
    type: 'Infographic',
    category: 'Process Education',
    description: 'อินโฟกราฟิกอธิบายขั้นตอนการดำเนินโปรเจค Solar EPC 5 ขั้นตอน ตั้งแต่ Survey → Design → Install → Commission → O&M แบบครบวงจร',
    size: '1080×1920 px',
    created: '25 มี.ค. 2026',
    agent: 'Content-Pipeline',
    tags: ['EPC', 'Process', 'Installation', 'O&M'],
    color: '#10B981',
    icon: '⚙️',
    downloads: 156,
    views: 2940,
    stats: [
      { label: 'ขั้นตอน', value: '5 Steps' },
      { label: 'เวลาติดตั้ง', value: '2-4 สัปดาห์' },
      { label: 'Warranty', value: '10 ปี' },
      { label: 'O&M', value: '24/7 Monitor' },
    ],
  },
  {
    id: 'INF-003',
    title: 'เปรียบเทียบ Solar vs ค่าไฟ PEA — 2026',
    titleEn: 'Solar vs Grid Cost Comparison',
    type: 'Infographic',
    category: 'Cost Analysis',
    description: 'อินโฟกราฟิกเปรียบเทียบต้นทุนพลังงานไฟฟ้าจาก PEA/MEA กับ Solar Energy ปี 2026 พร้อมกราฟ projection 25 ปี และ Break-even point',
    size: '1080×1350 px',
    created: '20 มี.ค. 2026',
    agent: 'Content-Pipeline',
    tags: ['PEA', 'MEA', 'Cost Comparison', 'Grid Parity'],
    color: '#06B6D4',
    icon: '📊',
    downloads: 342,
    views: 8900,
    stats: [
      { label: 'ค่าไฟ PEA', value: '4.72 ฿/kWh' },
      { label: 'ค่าไฟ Solar', value: '1.8 ฿/kWh' },
      { label: 'ประหยัด', value: '62%/kWh' },
      { label: 'Break-even', value: 'ปีที่ 6' },
    ],
  },
  {
    id: 'INF-004',
    title: 'Carbon Footprint ลดได้ด้วย Solar — ESG',
    titleEn: 'Carbon Reduction with Solar ESG',
    type: 'Infographic',
    category: 'ESG & Sustainability',
    description: 'อินโฟกราฟิกแสดงการลด Carbon Footprint ด้วยระบบ Solar สำหรับธุรกิจที่ต้องการ ESG Compliance, Carbon Credit และ RE100 commitment',
    size: '1080×1920 px',
    created: '15 มี.ค. 2026',
    agent: 'Content-Pipeline',
    tags: ['ESG', 'Carbon Credit', 'RE100', 'Sustainability'],
    color: '#A855F7',
    icon: '🌱',
    downloads: 198,
    views: 5640,
    stats: [
      { label: 'CO₂ ลดได้', value: '580 tCO₂/ปี' },
      { label: 'เทียบกับ', value: '12,500 ต้นไม้' },
      { label: 'Carbon Credit', value: '฿1.2M/ปี' },
      { label: 'ESG Score', value: '+28 pts' },
    ],
  },
  {
    id: 'PROP-001',
    title: 'Investment Proposal — โซลาร์เซลล์ B2B 2026',
    titleEn: 'Solar Investment Proposal Template',
    type: 'Proposal',
    category: 'Sales Document',
    description: 'เทมเพลตใบเสนอราคาและ Investment Proposal สำหรับลูกค้า B2B ครอบคลุม: System Sizing, Financial Model, NPV/IRR Analysis, ROI ทีละปี, Payment Terms',
    size: '24 หน้า PDF',
    created: '1 เม.ย. 2026',
    agent: 'Kihei-26',
    tags: ['Proposal', 'NPV', 'IRR', 'Financial Model', 'Template'],
    color: '#F5A623',
    icon: '📋',
    downloads: 89,
    views: 1240,
    stats: [
      { label: 'หน้า', value: '24 หน้า' },
      { label: 'ครอบคลุม', value: 'Financial+Tech' },
      { label: 'ภาษา', value: 'ไทย/อังกฤษ' },
      { label: 'Format', value: 'PDF + Word' },
    ],
  },
  {
    id: 'GEM-001',
    title: 'Solar Panel Hero Image — Factory Scene',
    titleEn: 'AI Generated Factory Solar Hero',
    type: 'Image Gem',
    category: 'AI Generated',
    description: 'ภาพ AI-generated คุณภาพสูง: โรงงานอุตสาหกรรมพิษณุโลกพร้อม Solar Panels บนหลังคา ฟ้าใสแดดสดใส สำหรับ Social Media, Presentation และ Website',
    size: '2048×1024 px',
    created: '30 มี.ค. 2026',
    agent: 'Image-Gems-AI',
    tags: ['Hero Image', 'Factory', 'Solar', 'AI Art'],
    color: '#3B82F6',
    icon: '🖼️',
    downloads: 124,
    views: 3480,
  },
  {
    id: 'GEM-002',
    title: 'Solar Tech Dashboard — Dark UI Mockup',
    titleEn: 'AI Generated Dashboard UI Mockup',
    type: 'Image Gem',
    category: 'AI Generated',
    description: 'ภาพ AI-generated: Dashboard UI ธีมมืดสไตล์ SIRINX AI-WarRoom แสดงกราฟ Solar production, Real-time monitoring สำหรับ Pitch Deck และ Marketing',
    size: '1920×1080 px',
    created: '29 มี.ค. 2026',
    agent: 'Image-Gems-AI',
    tags: ['UI Mockup', 'Dashboard', 'Tech', 'Dark Theme'],
    color: '#06B6D4',
    icon: '💻',
    downloads: 78,
    views: 2100,
  },
  {
    id: 'BRO-001',
    title: 'SIRINX Solar Brochure 2026 — ดิจิทัล',
    titleEn: 'SIRINX Digital Brochure 2026',
    type: 'Brochure',
    category: 'Marketing Material',
    description: 'โบรชัวร์ดิจิทัล SIRINX Solar Energy ปี 2026 นำเสนอ Services, Case Studies, Team, Technology และ Contact ออกแบบสวยงาม พร้อมส่งลูกค้า',
    size: '8 หน้า PDF',
    created: '5 มี.ค. 2026',
    agent: 'CMO-Marketing',
    tags: ['Brochure', 'Company Profile', 'Case Study'],
    color: '#10B981',
    icon: '📄',
    downloads: 312,
    views: 6800,
  },
]

const typeColors: Record<string, string> = {
  'Infographic': '#F5A623',
  'Proposal': '#10B981',
  'Image Gem': '#3B82F6',
  'Brochure': '#A855F7',
}

export default function SalesMediaPage() {
  const [filterType, setFilterType] = useState('ทั้งหมด')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const types = ['ทั้งหมด', 'Infographic', 'Proposal', 'Image Gem', 'Brochure']
  const filtered = filterType === 'ทั้งหมด' ? mediaItems : mediaItems.filter(m => m.type === filterType)

  const totalDownloads = mediaItems.reduce((s, m) => s + m.downloads, 0)
  const totalViews = mediaItems.reduce((s, m) => s + m.views, 0)

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
            Sales Media Library
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            สื่อการขาย {mediaItems.length} ชิ้น · {totalDownloads.toLocaleString()} Downloads · {totalViews.toLocaleString()} Views
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={{
              padding: '8px 14px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
              color: '#64748B', fontSize: 13, cursor: 'pointer',
            }}
          >
            {viewMode === 'grid' ? '≡ List' : '⊞ Grid'}
          </button>
          <button style={{
            padding: '8px 18px', background: '#F5A623', border: 'none',
            borderRadius: 8, color: '#0A1628', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            + Upload สื่อ
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'สื่อทั้งหมด', value: `${mediaItems.length}`, sub: 'Assets', color: '#F5A623' },
          { label: 'Infographics', value: `${mediaItems.filter(m => m.type === 'Infographic').length}`, sub: 'ออกแบบโดย AI', color: '#F5A623' },
          { label: 'Downloads รวม', value: totalDownloads.toLocaleString(), sub: 'All Time', color: '#10B981' },
          { label: 'Views รวม', value: totalViews.toLocaleString(), sub: 'All Time', color: '#06B6D4' },
        ].map((kpi, i) => (
          <div key={i} className="glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, marginBottom: 6 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: '#334155' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilterType(t)} style={{
            padding: '7px 16px',
            background: filterType === t ? `${typeColors[t] || '#F5A623'}18` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${filterType === t ? `${typeColors[t] || '#F5A623'}40` : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, color: filterType === t ? (typeColors[t] || '#F5A623') : '#64748B',
            fontSize: 12, cursor: 'pointer', fontWeight: filterType === t ? 600 : 400,
          }}>
            {t}
            {t !== 'ทั้งหมด' && (
              <span style={{
                marginLeft: 6, fontSize: 10, padding: '1px 5px', borderRadius: 3,
                background: `${typeColors[t]}28`, color: typeColors[t],
              }}>
                {mediaItems.filter(m => m.type === t).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass"
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s' }}
              onClick={() => setSelectedItem(item)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = `${item.color}40`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              {/* Thumbnail */}
              <div style={{
                height: 160,
                background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
                borderBottom: `1px solid ${item.color}20`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{ fontSize: 48 }}>{item.icon}</div>
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  fontSize: 10, padding: '3px 8px', borderRadius: 4,
                  background: `${typeColors[item.type]}18`, color: typeColors[item.type],
                  border: `1px solid ${typeColors[item.type]}30`,
                  fontWeight: 600,
                }}>
                  {item.type}
                </div>
                <div style={{
                  position: 'absolute', bottom: 10, left: 10,
                  fontSize: 10, color: '#475569', fontFamily: 'monospace',
                }}>
                  {item.id}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '14px 16px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: '#F1F5F9', lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 10 }}>{item.created} · {item.agent}</div>

                {item.stats && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                    {item.stats.slice(0, 4).map((s, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: 6 }}>
                        <div style={{ fontSize: 9, color: '#475569' }}>{s.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 11, color: '#475569' }}>↓ {item.downloads}</span>
                    <span style={{ fontSize: 11, color: '#475569' }}>👁 {item.views.toLocaleString()}</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#334155' }}>{item.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="glass" style={{ padding: '8px' }}>
          {filtered.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 16px', borderRadius: 8,
                cursor: 'pointer', transition: 'background 0.15s',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
              onClick={() => setSelectedItem(item)}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: `${item.color}18`, border: `1px solid ${item.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#F1F5F9', marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{item.category} · {item.created} · {item.agent}</div>
              </div>
              <span style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 4,
                background: `${typeColors[item.type]}18`, color: typeColors[item.type],
                border: `1px solid ${typeColors[item.type]}30`, whiteSpace: 'nowrap',
              }}>{item.type}</span>
              <div style={{ textAlign: 'right', minWidth: 100 }}>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>↓ {item.downloads} · 👁 {item.views.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#334155' }}>{item.size}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {item.tags.slice(0, 2).map((tag, j) => (
                  <span key={j} style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 3,
                    background: 'rgba(255,255,255,0.04)', color: '#475569',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setSelectedItem(null)}>
          <div style={{
            background: '#0F1E35', border: `1px solid ${selectedItem.color}30`, borderRadius: 16,
            padding: '32px', width: 600, maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                  background: `${selectedItem.color}18`, border: `1px solid ${selectedItem.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                }}>{selectedItem.icon}</div>
                <div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 4,
                      background: `${typeColors[selectedItem.type]}18`, color: typeColors[selectedItem.type],
                      border: `1px solid ${typeColors[selectedItem.type]}30`,
                    }}>{selectedItem.type}</span>
                    <span style={{ fontSize: 10, color: '#475569', padding: '2px 0' }}>{selectedItem.id}</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#F1F5F9', lineHeight: 1.3 }}>{selectedItem.title}</h2>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, width: 28, height: 28, cursor: 'pointer', color: '#64748B',
                fontSize: 16, flexShrink: 0,
              }}>×</button>
            </div>

            {/* Description */}
            <div style={{
              padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 18,
            }}>
              <div style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.7 }}>{selectedItem.description}</div>
            </div>

            {/* Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[
                { label: 'สร้างโดย Agent', value: selectedItem.agent, color: '#A855F7' },
                { label: 'วันที่สร้าง', value: selectedItem.created, color: '#94A3B8' },
                { label: 'ขนาดไฟล์', value: selectedItem.size, color: '#64748B' },
                { label: 'Downloads', value: selectedItem.downloads.toString(), color: '#10B981' },
                { label: 'Views', value: selectedItem.views.toLocaleString(), color: '#06B6D4' },
                { label: 'Category', value: selectedItem.category, color: '#F5A623' },
              ].map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Stats if available */}
            {selectedItem.stats && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Key Metrics</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                  {selectedItem.stats.map((s, i) => (
                    <div key={i} style={{
                      padding: '12px', borderRadius: 10, textAlign: 'center',
                      background: `${selectedItem.color}10`, border: `1px solid ${selectedItem.color}20`,
                    }}>
                      <div style={{ fontSize: 9, color: '#475569', marginBottom: 5 }}>{s.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: selectedItem.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {selectedItem.tags.map((tag, i) => (
                <span key={i} style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.04)', color: '#64748B',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>#{tag}</span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{
                flex: 1, padding: '10px', background: selectedItem.color, border: 'none',
                borderRadius: 8, color: '#0A1628', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                ↓ Download
              </button>
              <button style={{
                flex: 1, padding: '10px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                color: '#94A3B8', fontSize: 13, cursor: 'pointer',
              }}>
                🔗 Copy Link
              </button>
              <button style={{
                padding: '10px 16px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                color: '#64748B', fontSize: 13, cursor: 'pointer',
              }}>
                ✏️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
