'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'

const provinces = [
  { name: 'กรุงเทพมหานคร', peakHours: 4.5 },
  { name: 'นนทบุรี', peakHours: 4.5 },
  { name: 'ปทุมธานี', peakHours: 4.5 },
  { name: 'สมุทรปราการ', peakHours: 4.5 },
  { name: 'ชลบุรี', peakHours: 4.6 },
  { name: 'ระยอง', peakHours: 4.7 },
  { name: 'เชียงใหม่', peakHours: 4.8 },
  { name: 'เชียงราย', peakHours: 4.7 },
  { name: 'ขอนแก่น', peakHours: 5.0 },
  { name: 'อุดรธานี', peakHours: 5.1 },
  { name: 'นครราชสีมา', peakHours: 4.9 },
  { name: 'ภูเก็ต', peakHours: 4.6 },
  { name: 'สุราษฎร์ธานี', peakHours: 4.7 },
  { name: 'หาดใหญ่ / สงขลา', peakHours: 4.5 },
  { name: 'อื่นๆ', peakHours: 4.5 },
]

const ELECTRICITY_RATE = 4.2   // THB/kWh average
const SYSTEM_COST_PER_KWP = 25000  // THB/kWp
const COVERAGE = 0.85          // 85% bill coverage
const DEGRADATION = 0.005      // 0.5%/year
const DISCOUNT_RATE = 0.05     // 5% discount rate
const SYSTEM_LIFE = 25         // years

function calcResults(bill: number, province: string) {
  if (!bill || bill <= 0) return null
  const peakHours = provinces.find(p => p.name === province)?.peakHours ?? 4.5
  const monthlyKwh = bill / ELECTRICITY_RATE
  const dailyKwh = monthlyKwh / 30
  const systemKwp = Math.ceil(dailyKwh / (peakHours * 0.85))
  const systemCost = systemKwp * SYSTEM_COST_PER_KWP
  const monthlySavings = bill * COVERAGE
  const annualSavings = monthlySavings * 12
  const paybackYears = systemCost / annualSavings

  let npv = -systemCost
  let cumulativeSavings = 0
  const chartData: { year: number; savings: number; cost: number }[] = [
    { year: 0, savings: 0, cost: systemCost },
  ]
  for (let y = 1; y <= SYSTEM_LIFE; y++) {
    const degradedSavings = annualSavings * Math.pow(1 - DEGRADATION, y - 1)
    npv += degradedSavings / Math.pow(1 + DISCOUNT_RATE, y)
    cumulativeSavings += degradedSavings
    chartData.push({
      year: y,
      savings: Math.round(cumulativeSavings),
      cost: systemCost,
    })
  }

  return { systemKwp, systemCost, monthlySavings, paybackYears, npv, chartData }
}

export default function CalculatorPage() {
  const [bill, setBill] = useState('')
  const [province, setProvince] = useState('กรุงเทพมหานคร')
  const [roofArea, setRoofArea] = useState('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const results = useMemo(() => calcResults(Number(bill), province), [bill, province])
  const maxKwpFromRoof = roofArea ? Math.floor(Number(roofArea) / 10) : null

  const paybackYear = results
    ? results.chartData.findIndex(d => d.savings >= d.cost) - 1
    : null

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
          Solar ROI Calculator
        </h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
          คำนวณผลตอบแทนการติดตั้งโซลาร์เซลล์สำหรับธุรกิจของคุณ
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
        {/* Input Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: '#F5A623' }}>ข้อมูลการใช้ไฟฟ้า</h3>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: 500 }}>
                ค่าไฟฟ้าเฉลี่ย/เดือน (บาท) *
              </label>
              <input
                type="number"
                value={bill}
                onChange={e => setBill(e.target.value)}
                placeholder="เช่น 250000"
                min="0"
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#E2E8F0', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {bill && Number(bill) > 0 && (
                <div style={{ fontSize: 11, color: '#475569', marginTop: 5 }}>
                  ≈ {Math.round(Number(bill) / ELECTRICITY_RATE).toLocaleString()} kWh/เดือน
                </div>
              )}
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: 500 }}>
                จังหวัด
              </label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#E2E8F0', fontSize: 14,
                  outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
                }}
              >
                {provinces.map(p => (
                  <option key={p.name} value={p.name} style={{ background: '#0F2040' }}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 4 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: 500 }}>
                พื้นที่หลังคาโดยประมาณ (ตร.ม.) — ไม่บังคับ
              </label>
              <input
                type="number"
                value={roofArea}
                onChange={e => setRoofArea(e.target.value)}
                placeholder="เช่น 500"
                min="0"
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#E2E8F0', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {maxKwpFromRoof && (
                <div style={{ fontSize: 11, color: '#475569', marginTop: 5 }}>
                  พื้นที่นี้รองรับได้ประมาณ {maxKwpFromRoof} kWp
                </div>
              )}
            </div>
          </div>

          {/* Assumptions box */}
          <div className="glass" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              สมมติฐานการคำนวณ
            </div>
            {[
              ['อัตราค่าไฟเฉลี่ย', `${ELECTRICITY_RATE} THB/kWh`],
              ['ราคาติดตั้ง', `฿${SYSTEM_COST_PER_KWP.toLocaleString()}/kWp`],
              ['ความครอบคลุมค่าไฟ', `${COVERAGE * 100}%`],
              ['ค่าเสื่อม Panel/ปี', `${DEGRADATION * 100}%`],
              ['อัตราคิดลด', `${DISCOUNT_RATE * 100}%`],
              ['อายุโซลาร์เซลล์', `${SYSTEM_LIFE} ปี`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>{k}</span>
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!results ? (
            <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>☀️</div>
              <div style={{ fontSize: 16, color: '#475569' }}>กรอกค่าไฟฟ้าเพื่อเริ่มคำนวณ</div>
              <div style={{ fontSize: 13, color: '#334155', marginTop: 8 }}>ค่าไฟขั้นต่ำที่แนะนำ: ฿50,000/เดือน</div>
            </div>
          ) : (
            <>
              {/* KPI Results */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
                {[
                  { label: 'ขนาดระบบ', value: `${results.systemKwp} kWp`, color: '#F5A623', icon: '⚡' },
                  { label: 'ค่าใช้จ่าย', value: `฿${(results.systemCost / 1000000).toFixed(2)}M`, color: '#06B6D4', icon: '💰' },
                  { label: 'ประหยัด/เดือน', value: `฿${Math.round(results.monthlySavings).toLocaleString()}`, color: '#10B981', icon: '📉' },
                  { label: 'คืนทุนใน', value: `${results.paybackYears.toFixed(1)} ปี`, color: '#A855F7', icon: '📅' },
                  { label: 'NPV 25 ปี', value: `฿${(results.npv / 1000000).toFixed(1)}M`, color: '#F59E0B', icon: '📈' },
                ].map(({ label, value, color, icon }) => (
                  <div key={label} className="glass" style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Cumulative Chart */}
              <div className="glass" style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>
                    ประหยัดสะสม vs ต้นทุนระบบ (25 ปี)
                  </h3>
                  {paybackYear !== null && paybackYear > 0 && (
                    <span style={{
                      fontSize: 12, color: '#10B981', background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.25)', padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                    }}>
                      คืนทุนปีที่ {paybackYear}
                    </span>
                  )}
                </div>
                {mounted ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={results.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="year" tick={{ fill: '#64748B', fontSize: 11 }}
                        axisLine={false} tickLine={false}
                        label={{ value: 'ปี', position: 'insideBottomRight', offset: -5, fill: '#475569', fontSize: 11 }}
                      />
                      <YAxis
                        tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false}
                        tickFormatter={(v: number) => `฿${(v / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        contentStyle={{ background: '#0F2040', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12 }}
                        formatter={(v: unknown, name: unknown) => [
                          `฿${((v as number) / 1000000).toFixed(2)}M`,
                          name === 'savings' ? 'ประหยัดสะสม' : 'ต้นทุนระบบ',
                        ]}
                        labelFormatter={(l: unknown) => `ปีที่ ${l}`}
                      />
                      <ReferenceLine
                        y={results.systemCost}
                        stroke="rgba(245,166,35,0.4)"
                        strokeDasharray="6 3"
                      />
                      <Area
                        type="monotone" dataKey="savings"
                        stroke="#10B981" strokeWidth={2}
                        fill="url(#savingsGrad)"
                      />
                      <Area
                        type="monotone" dataKey="cost"
                        stroke="#F5A623" strokeWidth={1.5}
                        fill="none" strokeDasharray="5 3"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                    กำลังโหลด...
                  </div>
                )}
                <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 2, background: '#10B981' }} />
                    <span style={{ fontSize: 11, color: '#64748B' }}>ประหยัดสะสม</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 2, background: '#F5A623', borderTop: '2px dashed #F5A623' }} />
                    <span style={{ fontSize: 11, color: '#64748B' }}>ต้นทุนระบบ</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(245,166,35,0.2)' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>
                    สนใจติดตั้งระบบขนาด {results.systemKwp} kWp?
                  </div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>
                    Agent Kihei-26 จะสร้างใบเสนอราคาละเอียดให้ภายใน 24 ชั่วโมง
                  </div>
                </div>
                <button style={{
                  padding: '12px 28px', background: '#F5A623', border: 'none',
                  borderRadius: 10, color: '#0A1628', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  ขอใบเสนอราคา →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
