'use client'

import { useState, useMemo } from 'react'
import type { Province } from '@/data/provinces'

interface SavingsCalculatorProps {
  province: Province
}

export default function SavingsCalculator({ province }: SavingsCalculatorProps) {
  const [monthlyBill, setMonthlyBill] = useState(100000)
  const [systemKwp, setSystemKwp] = useState(province.popularSystemSize)
  const [costPerKwp, setCostPerKwp] = useState(38000)

  const results = useMemo(() => {
    const annualKwh = systemKwp * province.sunHours * 365 * 0.8
    const annualSavings = Math.round(annualKwh * province.tariffPerUnit)
    const totalCost = systemKwp * costPerKwp
    const paybackYears = Math.round((totalCost / annualSavings) * 10) / 10
    const roi25yr = annualSavings * 25 - totalCost
    const savingsPct = Math.min(95, Math.round((annualSavings / (monthlyBill * 12)) * 100))
    const co2Saved = Math.round(annualKwh * 0.4788 / 1000)
    return { annualKwh, annualSavings, totalCost, paybackYears, roi25yr, savingsPct, co2Saved }
  }, [monthlyBill, systemKwp, costPerKwp, province])

  const formatTHB = (n: number) =>
    n >= 1000000
      ? `${(n / 1000000).toFixed(2)} ล้าน฿`
      : `${n.toLocaleString()} ฿`

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6">
        คำนวณผลประหยัด — โซลาร์เซลล์{province.nameTh}
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              ค่าไฟเฉลี่ยต่อเดือน (บาท)
            </label>
            <input
              type="number"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-solar-gold"
              min={10000}
              step={10000}
            />
            <input
              type="range"
              min={10000}
              max={2000000}
              step={10000}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full mt-2 accent-solar-gold"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>10K</span><span>2M บาท/เดือน</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              ขนาดระบบโซลาร์ (kWp)
            </label>
            <input
              type="number"
              value={systemKwp}
              onChange={(e) => setSystemKwp(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-solar-gold"
              min={5}
              step={5}
            />
            <input
              type="range"
              min={5}
              max={2000}
              step={5}
              value={systemKwp}
              onChange={(e) => setSystemKwp(Number(e.target.value))}
              className="w-full mt-2 accent-solar-gold"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5 kWp (บ้าน)</span><span>2,000 kWp (โรงงาน)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              ราคาติดตั้ง (บาท/kWp)
            </label>
            <input
              type="number"
              value={costPerKwp}
              onChange={(e) => setCostPerKwp(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-solar-gold"
              min={30000}
              step={1000}
            />
            <p className="text-xs text-slate-500 mt-1">
              ค่าเฉลี่ยตลาด 35,000–45,000 บาท/kWp (รวมอุปกรณ์+ติดตั้ง)
            </p>
          </div>

          {/* Province info */}
          <div className="bg-solar-gold/10 border border-solar-gold/20 rounded-xl p-4">
            <div className="text-sm text-slate-300 mb-2">ข้อมูล{province.nameTh}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-400">แสงแดด: </span>
                <span className="text-solar-gold font-medium">{province.sunHours} ชม./วัน</span>
              </div>
              <div>
                <span className="text-slate-400">ค่าไฟ: </span>
                <span className="text-solar-gold font-medium">{province.tariffPerUnit} ฿/หน่วย</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-emerald/10 border border-emerald/30 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-1">ประหยัดได้ต่อปี</div>
            <div className="text-3xl font-bold text-emerald">{formatTHB(results.annualSavings)}</div>
            <div className="text-sm text-slate-400 mt-1">
              ลดค่าไฟได้ ~{results.savingsPct}% ต่อปี
            </div>
          </div>

          <div className="bg-solar-gold/10 border border-solar-gold/30 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-1">คืนทุนใน</div>
            <div className="text-3xl font-bold text-solar-gold">{results.paybackYears} ปี</div>
            <div className="text-sm text-slate-400 mt-1">
              เงินลงทุน {formatTHB(results.totalCost)}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-1">ROI ตลอด 25 ปี</div>
            <div className="text-3xl font-bold text-blue-400">{formatTHB(results.roi25yr)}</div>
            <div className="text-sm text-slate-400 mt-1">
              กำไรสุทธิหลังหักเงินลงทุน
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-1">ลดคาร์บอนต่อปี</div>
            <div className="text-3xl font-bold text-green-400">{results.co2Saved} tCO₂</div>
            <div className="text-sm text-slate-400 mt-1">
              เทียบต้นไม้ {(results.co2Saved * 45).toLocaleString()} ต้น
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-6">
        * คำนวณโดยประมาณ ใช้ค่าแสงแดดเฉลี่ยของ{province.nameTh} ({province.sunHours} ชม./วัน) และประสิทธิภาพระบบ 80%
        ผลลัพธ์จริงอาจแตกต่างตามสภาพหน้างาน ทิศและมุมหลังคา
      </p>
    </div>
  )
}
