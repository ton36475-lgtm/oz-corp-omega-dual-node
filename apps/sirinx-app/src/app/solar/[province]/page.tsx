import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  provinces,
  getProvinceBySlug,
  getAllSlugs,
  getProvincesByRegion,
  REGION_LABELS,
} from '@/data/provinces'
import SolarPotential from '@/components/seo/SolarPotential'
import SavingsCalculator from '@/components/seo/SavingsCalculator'
import LeadCaptureForm from '@/components/seo/LeadCaptureForm'
import LocalFAQ from '@/components/seo/LocalFAQ'

export const dynamic = 'force-static'

// ===== STATIC PARAMS =====
export async function generateStaticParams() {
  return getAllSlugs().map((province) => ({ province }))
}

// ===== METADATA =====
export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string }>
}): Promise<Metadata> {
  const { province: slug } = await params
  const province = getProvinceBySlug(slug)
  if (!province) return { title: 'ไม่พบหน้า' }

  const year = new Date().getFullYear() + 543 // Thai year (พ.ศ.)
  const title = `โซลาร์เซลล์${province.nameTh} | ติดตั้งโซลาร์เซลล์ราคาถูก ${year} | SIRINX`
  const description =
    `ติดตั้งโซลาร์เซลล์${province.nameTh} ลดค่าไฟ 50-80% แสงแดด ${province.sunHours} ชม./วัน ` +
    `ระบบ ${province.popularSystemSize} kWp ยอดนิยม ประหยัดได้ ${(province.estimatedSavings / 1000000).toFixed(1)} ล้านบาท/ปี ` +
    `รับประกัน 25 ปี สำรวจหน้างานฟรี โทร SIRINX วันนี้`

  return {
    title,
    description,
    keywords: [
      `โซลาร์เซลล์${province.nameTh}`,
      `ติดตั้งโซลาร์เซลล์${province.nameTh}`,
      `solar cell ${province.nameEn}`,
      `ราคาโซลาร์เซลล์${province.nameTh} ${year}`,
      `บริษัทโซลาร์เซลล์${province.nameTh}`,
      `โซลาร์รูฟท็อป${province.nameTh}`,
    ].join(', '),
    openGraph: {
      title: `โซลาร์เซลล์${province.nameTh} — SIRINX Smart Energy`,
      description: `ลดค่าไฟ 50-80% ด้วยโซลาร์เซลล์คุณภาพสูง บริการครบวงจรใน${province.nameTh} ` +
        `แสงแดด ${province.sunHours} ชม./วัน รับประกัน 25 ปี`,
      type: 'website',
      locale: 'th_TH',
      siteName: 'SIRINX Solar Energy',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/solar/${slug}`,
    },
  }
}

// ===== PAGE =====
export default async function ProvincePage({
  params,
}: {
  params: Promise<{ province: string }>
}) {
  const { province: slug } = await params
  const province = getProvinceBySlug(slug)
  if (!province) notFound()

  const year = new Date().getFullYear() + 543
  const annualSavingsM = (province.estimatedSavings / 1000000).toFixed(1)
  const paybackYears = Math.round(
    (province.popularSystemSize * 38000) / province.estimatedSavings * 10
  ) / 10

  // Adjacent provinces (same region)
  const regionProvinces = getProvincesByRegion(province.region)
    .filter((p) => p.slug !== province.slug)
    .slice(0, 6)

  // Schema: LocalBusiness
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://sirinx.com/solar/${province.slug}#localbusiness`,
    name: `SIRINX Solar Energy — ${province.nameTh}`,
    alternateName: `ไซรินซ์ โซลาร์เซลล์${province.nameTh}`,
    description: `บริษัทติดตั้งโซลาร์เซลล์ครบวงจรใน${province.nameTh} ลดค่าไฟ 50-80% รับประกัน 25 ปี`,
    url: `https://sirinx.com/solar/${province.slug}`,
    telephone: '+66-55-000-0000',
    areaServed: { '@type': 'AdministrativeArea', name: province.nameTh },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'พิษณุโลก',
      addressRegion: 'พิษณุโลก',
      addressCountry: 'TH',
    },
    geo: { '@type': 'GeoCoordinates', latitude: province.lat, longitude: province.lng },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
    priceRange: '฿฿',
    currenciesAccepted: 'THB',
    sameAs: ['https://www.facebook.com/sirinx'],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
    },
  }

  // Schema: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://sirinx.com' },
      { '@type': 'ListItem', position: 2, name: 'บริการโซลาร์เซลล์', item: 'https://sirinx.com/solar' },
      { '@type': 'ListItem', position: 3, name: `โซลาร์เซลล์${province.nameTh}`, item: `https://sirinx.com/solar/${province.slug}` },
    ],
  }

  // Schema: Product
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `ระบบโซลาร์เซลล์${province.nameTh} — SIRINX`,
    description: `ระบบโซลาร์เซลล์ออนกริดสำหรับ${province.keyIndustries[0]}ใน${province.nameTh} ขนาด ${province.popularSystemSize} kWp`,
    brand: { '@type': 'Brand', name: 'SIRINX' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'THB',
      price: String(province.popularSystemSize * 38000),
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: 'https://schema.org/InStock',
      areaServed: province.nameTh,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
    },
  }

  const isHQ = province.slug === 'phitsanulok'

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

        {/* Breadcrumb */}
        <nav className="px-6 pt-6 pb-0 max-w-6xl mx-auto" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-white transition-colors">หน้าหลัก</Link></li>
            <li className="text-slate-600">/</li>
            <li><Link href="/solar" className="hover:text-white transition-colors">โซลาร์เซลล์ทั่วไทย</Link></li>
            <li className="text-slate-600">/</li>
            <li className="text-solar-gold font-medium">{province.nameTh}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              {isHQ && (
                <div className="inline-flex items-center gap-2 bg-solar-gold/20 text-solar-gold text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-solar-gold/30">
                  ⭐ สำนักงานใหญ่ SIRINX — บริการเร็วที่สุด
                </div>
              )}

              <div className="text-solar-gold text-sm font-semibold tracking-widest uppercase mb-3">
                {province.regionTh} · {province.nameEn}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                ติดตั้งโซลาร์เซลล์<br />
                <span className="text-solar-gold">{province.nameTh}</span>
              </h1>

              <p className="text-slate-400 text-lg mb-6 max-w-xl">
                ลดค่าไฟ 50–80% ด้วยโซลาร์เซลล์คุณภาพสูงใน{province.nameTh}
                แสงแดดเฉลี่ย {province.sunHours} ชั่วโมง/วัน คืนทุนภายใน {paybackYears} ปี
                รับประกัน 25 ปี
              </p>

              <p className="text-slate-300 mb-8 leading-relaxed">
                {province.localBenefits}
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-solar-gold/10 border border-solar-gold/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-solar-gold">{province.sunHours}</div>
                  <div className="text-xs text-slate-400">ชม.แดด/วัน</div>
                </div>
                <div className="bg-emerald/10 border border-emerald/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald">{paybackYears}</div>
                  <div className="text-xs text-slate-400">ปีคืนทุน</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{annualSavingsM}M</div>
                  <div className="text-xs text-slate-400">฿ ประหยัด/ปี</div>
                </div>
              </div>

              {/* Key industries */}
              <div className="mb-6">
                <div className="text-sm text-slate-400 mb-2">อุตสาหกรรมหลักใน{province.nameTh}</div>
                <div className="flex flex-wrap gap-2">
                  {province.keyIndustries.map((ind) => (
                    <span key={ind} className="bg-white/10 text-slate-300 px-3 py-1 rounded-full text-sm border border-white/10">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#lead-form"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-solar-gold to-yellow-400 text-deep-navy font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
                >
                  ขอใบเสนอราคาฟรี
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="tel:+6655000000"
                  className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/15 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  โทรปรึกษาฟรี
                </a>
              </div>
            </div>

            {/* Compact lead form on desktop */}
            <div className="w-full lg:w-96 lg:sticky lg:top-6" id="lead-form">
              <LeadCaptureForm province={province} variant="compact" />
            </div>
          </div>
        </section>

        {/* Solar Potential */}
        <section className="px-6 pb-10 max-w-6xl mx-auto">
          <SolarPotential province={province} systemKwp={province.popularSystemSize} />
        </section>

        {/* Services */}
        <section className="px-6 pb-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            บริการติดตั้งโซลาร์เซลล์ครบวงจรใน{province.nameTh}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: '🔍',
                title: 'สำรวจและออกแบบระบบ (ฟรี)',
                desc: `ทีมวิศวกร SIRINX เข้าสำรวจหลังคาใน${province.nameTh} วัดพื้นที่ วิเคราะห์ข้อมูลการใช้ไฟ และออกแบบระบบที่เหมาะสม ไม่มีค่าใช้จ่าย`,
              },
              {
                icon: '☀️',
                title: 'จัดหาอุปกรณ์ Tier 1',
                desc: 'แผงโซลาร์ Longi, JA Solar, Jinko อินเวอร์เตอร์ SMA, Huawei, SolarEdge มาตรฐาน IEC รับประกัน 25 ปี',
              },
              {
                icon: '⚡',
                title: 'ติดตั้งโดยช่างมืออาชีพ',
                desc: `ช่างติดตั้งที่ได้รับการรับรองจาก กกพ. ประสบการณ์ติดตั้งใน${province.nameTh}และภูมิภาค ปลอดภัย ตามมาตรฐาน`,
              },
              {
                icon: '📋',
                title: 'ขึ้นทะเบียน Net Metering',
                desc: `ดำเนินเอกสาร${province.electricityAuthority === 'MEA' ? 'MEA' : 'PEA'} ยื่นขอเชื่อมต่อระบบ Net Metering ให้ครบถ้วน ไม่ต้องยุ่งยากเอง`,
              },
              {
                icon: '📱',
                title: 'ติดตาม Real-time ผ่าน App',
                desc: 'ดูผลผลิตไฟฟ้า ค่าไฟที่ประหยัดได้ และสุขภาพระบบผ่านมือถือได้ 24/7 ด้วย SIRINX Smart Monitor',
              },
              {
                icon: '🔧',
                title: 'O&M บำรุงรักษา 5 ปี',
                desc: `บริการบำรุงรักษาและซ่อมบำรุงครอบคลุม 5 ปี รวมในสัญญา ทีมช่างประจำ${province.regionTh}`,
              },
            ].map((s) => (
              <div key={s.title} className="bg-white/5 rounded-2xl border border-white/10 p-5">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Savings Calculator */}
        <section className="px-6 pb-10 max-w-6xl mx-auto">
          <SavingsCalculator province={province} />
        </section>

        {/* Packages */}
        <section className="px-6 pb-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            ราคาโซลาร์เซลล์{province.nameTh} {year}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'บ้านพักอาศัย', size: '5–30 kWp', price: '175,000–1,050,000', icon: '🏠', desc: 'บ้านเดี่ยว ทาวน์โฮม คอนโด' },
              { label: 'SME / อาคาร', size: '30–100 kWp', price: '1.05–3.5 ล้าน', icon: '🏢', desc: 'ออฟฟิศ ร้านค้า อาคารพาณิชย์' },
              { label: 'โรงงาน / คลังสินค้า', size: '100–1,000 kWp', price: '3.5–35 ล้าน', icon: '🏭', desc: 'โรงงานอุตสาหกรรม โกดัง' },
              { label: 'Solar Farm', size: '1,000 kWp+', price: 'ขอใบเสนอราคา', icon: '🌞', desc: 'โครงการพลังงานแสงอาทิตย์ขนาดใหญ่' },
            ].map((pkg) => (
              <div key={pkg.label} className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col">
                <div className="text-4xl mb-3">{pkg.icon}</div>
                <h3 className="font-bold text-white mb-1">{pkg.label}</h3>
                <div className="text-solar-gold font-semibold text-sm mb-2">{pkg.size}</div>
                <p className="text-slate-400 text-sm flex-1 mb-4">{pkg.desc}</p>
                <div className="text-white font-bold">{pkg.price} ฿</div>
                <a
                  href="#lead-form"
                  className="mt-4 text-center text-sm text-solar-gold hover:text-yellow-300 transition-colors"
                >
                  ขอใบเสนอราคา →
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            * ราคาโดยประมาณ รวมค่าอุปกรณ์และติดตั้ง ไม่รวมภาษี VAT 7% ราคาจริงขึ้นอยู่กับสภาพหน้างาน
          </p>
        </section>

        {/* Testimonials placeholder */}
        <section className="px-6 pb-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            รีวิวลูกค้า{province.nameTh}
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                name: 'คุณสมชาย',
                company: `โรงงานใน${province.nameTh}`,
                text: `ติดตั้ง ${province.popularSystemSize} kWp ลดค่าไฟได้กว่า 60% ทีมงาน SIRINX มืออาชีพมาก ดูแลดีตั้งแต่ต้นจนจบ`,
                rating: 5,
              },
              {
                name: 'คุณสมหญิง',
                company: `${province.keyIndustries[0]}ใน${province.nameTh}`,
                text: 'คืนทุนเร็วกว่าที่คาด ระบบ monitoring ดูง่าย แนะนำเพื่อนธุรกิจหลายรายแล้ว',
                rating: 5,
              },
              {
                name: 'คุณวิชัย',
                company: `คลังสินค้า${province.nameTh}`,
                text: `ลดค่าไฟจาก ${(province.avgElectricityCost / 1000).toFixed(0)}K บาทเหลือไม่ถึงครึ่ง O&M ครบถ้วน ไม่ต้องกังวลเรื่องดูแล`,
                rating: 5,
              },
            ].map((t) => (
              <div key={t.name} className="bg-white/5 rounded-2xl border border-white/10 p-5">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-solar-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-medium text-white text-sm">{t.name}</div>
                  <div className="text-slate-400 text-xs">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 pb-10 max-w-6xl mx-auto">
          <LocalFAQ province={province} />
        </section>

        {/* Full lead form section */}
        <section className="px-6 pb-10 max-w-3xl mx-auto" id="contact">
          <LeadCaptureForm province={province} variant="full" />
        </section>

        {/* Nearby provinces */}
        {regionProvinces.length > 0 && (
          <section className="px-6 pb-10 max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              โซลาร์เซลล์จังหวัดใกล้เคียง — {REGION_LABELS[province.region]}
            </h2>
            <div className="flex flex-wrap gap-3">
              {regionProvinces.map((p) => (
                <Link
                  key={p.slug}
                  href={`/solar/${p.slug}`}
                  className="bg-white/5 border border-white/10 text-slate-300 px-4 py-2 rounded-xl hover:border-solar-gold/40 hover:text-solar-gold transition-all text-sm"
                >
                  โซลาร์เซลล์{p.nameTh}
                </Link>
              ))}
              <Link
                href="/solar"
                className="bg-solar-gold/10 border border-solar-gold/20 text-solar-gold px-4 py-2 rounded-xl hover:bg-solar-gold/20 transition-all text-sm"
              >
                ดูทั้ง 77 จังหวัด →
              </Link>
            </div>
          </section>
        )}

        {/* Footer nav */}
        <section className="bg-white/5 border-t border-white/10 px-6 py-8 text-center">
          <div className="text-slate-400 text-sm mb-4">
            SIRINX Solar Energy · ติดตั้งโซลาร์เซลล์ {province.nameTh} · {province.nameEn} · {year}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/solar" className="text-slate-400 hover:text-white transition-colors">← ทุกจังหวัด</Link>
            <Link href="/calculator" className="text-slate-400 hover:text-white transition-colors">คำนวณ ROI</Link>
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">CEO WarRoom</Link>
          </div>
        </section>
      </div>
    </>
  )
}
