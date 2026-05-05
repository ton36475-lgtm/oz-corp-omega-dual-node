import Link from 'next/link'
import type { Province } from '@/data/provinces'

interface ProvinceCardProps {
  province: Province
}

export default function ProvinceCard({ province }: ProvinceCardProps) {
  const annualSavingsM = (province.estimatedSavings / 1000000).toFixed(1)
  const priorityColor = province.priority === 'P1' ? '#F5A623' : province.priority === 'P2' ? '#10B981' : '#64748B'

  return (
    <Link
      href={`/solar/${province.slug}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-solar-gold/40 hover:bg-white/10 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg group-hover:text-solar-gold transition-colors">
            {province.nameTh}
          </h3>
          <p className="text-slate-400 text-sm">{province.nameEn}</p>
        </div>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: `${priorityColor}20`, color: priorityColor }}
        >
          {province.priority}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-slate-400 mb-1">แสงแดด</div>
          <div className="flex items-end gap-1">
            <span className="text-xl font-bold text-solar-gold">{province.sunHours}</span>
            <span className="text-xs text-slate-400 mb-1">ชม./วัน</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-slate-400 mb-1">ประหยัดได้/ปี</div>
          <div className="flex items-end gap-1">
            <span className="text-xl font-bold text-emerald">{annualSavingsM}</span>
            <span className="text-xs text-slate-400 mb-1">ล้านบาท</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs text-slate-400">ขนาดระบบยอดนิยม</div>
        <div className="text-sm font-medium text-white mt-1">{province.popularSystemSize} kWp</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {province.keyIndustries.slice(0, 2).map((ind) => (
            <span key={ind} className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
              {ind}
            </span>
          ))}
        </div>
        <svg
          className="w-4 h-4 text-solar-gold opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
