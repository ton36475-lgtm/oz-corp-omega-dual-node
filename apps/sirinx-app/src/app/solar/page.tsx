import type { Metadata } from 'next'
import Link from 'next/link'
import { provinces, REGION_LABELS, REGION_EN, type Region } from '@/data/provinces'
import ProvinceCard from '@/components/seo/ProvinceCard'

export const metadata: Metadata = {
  title: 'ติดตั้งโซลาร์เซลล์ทั่วไทย 77 จังหวัด | SIRINX Solar Energy',
  description:
    'บริการติดตั้งโซลาร์เซลล์ครบวงจรทั่วประเทศไทย 77 จังหวัด ลดค่าไฟ 50-80% รับประกัน 25 ปี ' +
    'สำรวจหน้างานฟรี ราคาเริ่มต้น 35,000 บาท/kWp โดย SIRINX Solar Energy',
  keywords:
    'โซลาร์เซลล์ทั่วไทย, ติดตั้งโซลาร์เซลล์ 77 จังหวัด, solar cell thailand, บริษัทโซลาร์เซลล์ไทย',
  openGraph: {
    title: 'ติดตั้งโซลาร์เซลล์ทั่วไทย 77 จังหวัด | SIRINX',
    description: 'ลดค่าไฟ 50-80% ด้วยโซลาร์เซลล์คุณภาพสูง บริการครบวงจรทั่วประเทศไทย',
    type: 'website',
    locale: 'th_TH',
  },
  alternates: { canonical: '/solar' },
}

const REGION_ORDER: Region[] = ['central', 'east', 'west', 'north', 'northeast', 'south']

const REGION_ICONS: Record<Region, string> = {
  central:   '🏙️',
  east:      '🏭',
  west:      '🌿',
  north:     '⛰️',
  northeast: '🌾',
  south:     '🏖️',
}

export default function SolarIndexPage() {
  const p1Count = provinces.filter((p) => p.priority === 'P1').length
  const avgSunHours = (provinces.reduce((s, p) => s + p.sunHours, 0) / provinces.length).toFixed(1)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-solar-gold text-sm font-semibold tracking-widest uppercase mb-4">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          SIRINX Solar Energy
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          ติดตั้งโซลาร์เซลล์<br />
          <span className="text-solar-gold">ทั่วประเทศไทย 77 จังหวัด</span>
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          ลดค่าไฟ 50–80% ด้วยโซลาร์เซลล์คุณภาพสูง บริการครบวงจรตั้งแต่สำรวจ ออกแบบ ติดตั้ง
          จนถึงบำรุงรักษา รับประกัน 25 ปี
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="bg-solar-gold/10 border border-solar-gold/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-solar-gold">77</div>
            <div className="text-xs text-slate-400">จังหวัด</div>
          </div>
          <div className="bg-emerald/10 border border-emerald/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-emerald">{avgSunHours}</div>
            <div className="text-xs text-slate-400">ชม.แดด/วัน เฉลี่ย</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{p1Count}</div>
            <div className="text-xs text-slate-400">จังหวัด Priority 1</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-purple-400">25</div>
            <div className="text-xs text-slate-400">ปีรับประกัน</div>
          </div>
        </div>

        <Link
          href="/solar/phitsanulok"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-solar-gold to-yellow-400 text-deep-navy font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg"
        >
          ขอใบเสนอราคาฟรี
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      {/* Province listing by region */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {REGION_ORDER.map((region) => {
          const regionProvinces = provinces.filter((p) => p.region === region)
          const regionLabel = REGION_LABELS[region]
          const regionEn = REGION_EN[region]

          return (
            <div key={region} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{REGION_ICONS[region]}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{regionLabel}</h2>
                  <p className="text-slate-400 text-sm">{regionEn} · {regionProvinces.length} จังหวัด</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {regionProvinces.map((p) => (
                  <ProvinceCard key={p.slug} province={p} />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Why SIRINX */}
      <section className="bg-white/5 border-t border-white/10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            ทำไมต้องเลือก SIRINX Solar Energy?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: '47 Ronin AI System', desc: 'ระบบ AI 47 ตัวช่วยวิเคราะห์โปรเจกต์ ออกแบบระบบ และติดตามผลผลิตอัตโนมัติ' },
              { icon: '📍', title: 'ครอบคลุม 77 จังหวัด', desc: 'ทีมวิศวกรประจำทุกภูมิภาค สำรวจหน้างานฟรี ตอบกลับภายใน 24 ชั่วโมง' },
              { icon: '⚡', title: 'ติดตั้งเร็ว 7–14 วัน', desc: 'กระบวนการออกแบบและจัดหาอุปกรณ์รวดเร็ว ด้วยซัพพลายเชนที่แข็งแกร่ง' },
              { icon: '🛡️', title: 'รับประกัน 25 ปี', desc: 'แผงโซลาร์ Tier 1 รับประกัน 25 ปี อินเวอร์เตอร์ 10 ปี พร้อม O&M ครบวงจร' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            พร้อมลดค่าไฟ 50–80%?
          </h2>
          <p className="text-slate-400 mb-8">
            เลือกจังหวัดของคุณด้านบน หรือติดต่อทีม SIRINX เพื่อรับคำแนะนำเฉพาะสำหรับธุรกิจของคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+6655000000"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-solar-gold to-yellow-400 text-deep-navy font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              โทรหาเรา
            </a>
            <Link
              href="/calculator"
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/15 transition-colors"
            >
              คำนวณ ROI
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
