import type { Province } from '@/data/provinces'

interface SolarPotentialProps {
  province: Province
  systemKwp?: number
}

export default function SolarPotential({ province, systemKwp = 100 }: SolarPotentialProps) {
  const annualKwh = Math.round(systemKwp * province.sunHours * 365 * 0.8)
  const annualSavings = Math.round(annualKwh * province.tariffPerUnit)
  const co2Saved = Math.round(annualKwh * 0.4788 / 1000) // tCO2e (Thai grid factor)
  const thaiAvgSunHours = 4.8

  const bars = [
    { label: 'ม.ค.', factor: 0.92 },
    { label: 'ก.พ.', factor: 1.05 },
    { label: 'มี.ค.', factor: 1.10 },
    { label: 'เม.ย.', factor: 1.08 },
    { label: 'พ.ค.', factor: 0.95 },
    { label: 'มิ.ย.', factor: 0.80 },
    { label: 'ก.ค.', factor: 0.82 },
    { label: 'ส.ค.', factor: 0.88 },
    { label: 'ก.ย.', factor: 0.85 },
    { label: 'ต.ค.', factor: 0.90 },
    { label: 'พ.ย.', factor: 0.95 },
    { label: 'ธ.ค.', factor: 0.90 },
  ]

  const maxFactor = Math.max(...bars.map((b) => b.factor))

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6">
        ศักยภาพโซลาร์เซลล์{province.nameTh}
      </h2>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-solar-gold/10 border border-solar-gold/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-solar-gold">{province.sunHours}</div>
          <div className="text-xs text-slate-400 mt-1">ชั่วโมงแดด/วัน</div>
          <div className="text-xs text-slate-500 mt-1">เฉลี่ยทั้งปี</div>
        </div>
        <div className="bg-emerald/10 border border-emerald/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-emerald">
            {(annualKwh / 1000).toFixed(0)}
          </div>
          <div className="text-xs text-slate-400 mt-1">MWh ต่อปี</div>
          <div className="text-xs text-slate-500 mt-1">ระบบ {systemKwp} kWp</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">
            {(annualSavings / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-slate-400 mt-1">บาท/ปี</div>
          <div className="text-xs text-slate-500 mt-1">ประหยัดได้</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{co2Saved}</div>
          <div className="text-xs text-slate-400 mt-1">tCO₂/ปี</div>
          <div className="text-xs text-slate-500 mt-1">ลดคาร์บอน</div>
        </div>
      </div>

      {/* Comparison bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">เทียบค่าเฉลี่ยทั่วประเทศ</span>
          <span className="text-solar-gold font-medium">
            {province.sunHours > thaiAvgSunHours ? '+' : ''}
            {((province.sunHours / thaiAvgSunHours - 1) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex-1 bg-white/10 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-solar-gold to-yellow-300"
              style={{ width: `${(province.sunHours / 6) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-white w-16 text-right">
            {province.nameTh.substring(0, 6)}
          </span>
        </div>
        <div className="flex gap-3 items-center mt-2">
          <div className="flex-1 bg-white/10 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-slate-500"
              style={{ width: `${(thaiAvgSunHours / 6) * 100}%` }}
            />
          </div>
          <span className="text-sm text-slate-400 w-16 text-right">ค่าเฉลี่ย</span>
        </div>
      </div>

      {/* Monthly chart */}
      <div>
        <div className="text-sm text-slate-400 mb-3">การผลิตไฟฟ้ารายเดือน (ประมาณการ)</div>
        <div className="flex items-end gap-1 h-24">
          {bars.map((bar) => {
            const height = (bar.factor / maxFactor) * 100
            const kwh = Math.round((systemKwp * province.sunHours * 30 * 0.8 * bar.factor))
            return (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  <div
                    className="w-full rounded-sm bg-solar-gold/60 hover:bg-solar-gold transition-colors cursor-default"
                    style={{ height: `${height * 0.9}px` }}
                    title={`${bar.label}: ${kwh.toLocaleString()} kWh`}
                  />
                </div>
                <span className="text-xs text-slate-500 writing-mode-vertical" style={{ fontSize: '9px' }}>
                  {bar.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        * ข้อมูลอ้างอิงจาก NASA POWER / Global Solar Atlas | ระบบ {systemKwp} kWp | ประสิทธิภาพ 80%
      </p>
    </div>
  )
}
