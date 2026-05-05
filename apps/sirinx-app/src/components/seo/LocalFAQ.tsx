'use client'

import { useState } from 'react'
import type { Province } from '@/data/provinces'

interface FAQItem {
  q: string
  a: string
}

function buildFAQs(province: Province): FAQItem[] {
  const { nameTh, sunHours, tariffPerUnit } = province
  const paybackLow = Math.round(35000 * province.popularSystemSize / province.estimatedSavings * 10) / 10
  const paybackHigh = paybackLow + 2

  return [
    {
      q: `โซลาร์เซลล์${nameTh} ราคาเท่าไหร่ในปี 2569?`,
      a: `ราคาติดตั้งโซลาร์เซลล์ใน${nameTh} ปี 2569 เริ่มต้นที่ 35,000–45,000 บาทต่อ kWp สำหรับระบบที่อยู่อาศัย ขนาด 5 kWp ราคาประมาณ 175,000–225,000 บาท รวมค่าอุปกรณ์และติดตั้ง รับประกันแผง 25 ปี อินเวอร์เตอร์ 10 ปี`,
    },
    {
      q: `ติดตั้งโซลาร์เซลล์ใน${nameTh} คืนทุนกี่ปี?`,
      a: `ระยะเวลาคืนทุนใน${nameTh} อยู่ที่ประมาณ ${paybackLow}–${paybackHigh} ปี เนื่องจาก${nameTh}มีค่าแสงแดดเฉลี่ย ${sunHours} ชั่วโมง/วัน และค่าไฟ ${tariffPerUnit} บาท/หน่วย ทำให้ผลิตไฟฟ้าได้คุ้มค่าตลอดทั้งปี`,
    },
    {
      q: `ขั้นตอนการติดตั้งโซลาร์เซลล์ใน${nameTh} มีอะไรบ้าง?`,
      a: `มี 6 ขั้นตอน: 1) สำรวจหน้างานและออกแบบระบบฟรี 2) เสนอราคาและเซ็นสัญญา 3) จัดหาอุปกรณ์ Tier 1 4) ติดตั้งโดยช่างที่ได้รับการรับรองจาก กกพ. 5) ทดสอบระบบและตรวจสอบความปลอดภัย 6) ยื่นขอเชื่อมต่อกับการไฟฟ้า${province.electricityAuthority === 'MEA' ? 'นครหลวง (MEA)' : 'ส่วนภูมิภาค (PEA)'}ใน${nameTh}`,
    },
    {
      q: `โซลาร์เซลล์ใน${nameTh} เหมาะกับธุรกิจประเภทใด?`,
      a: `เหมาะที่สุดกับ: ${province.keyIndustries.join(', ')} และธุรกิจที่มีค่าไฟเกิน 50,000 บาท/เดือน โดยเฉพาะที่มีหลังคาหรือพื้นที่ว่างเพียงพอสำหรับติดแผง Solar`,
    },
    {
      q: `SIRINX ให้บริการครอบคลุมพื้นที่ใดใน${nameTh}?`,
      a: `SIRINX ให้บริการครอบคลุมทุกอำเภอใน${nameTh} มีทีมวิศวกรประจำภูมิภาคพร้อมสำรวจหน้างานฟรี ไม่มีค่าใช้จ่าย ติดต่อ SIRINX วันนี้เพื่อนัดสำรวจ`,
    },
    {
      q: `โซลาร์เซลล์ใน${nameTh} ดูแลรักษาอย่างไร?`,
      a: `ระบบโซลาร์เซลล์ดูแลง่ายมาก ล้างแผงปีละ 2–3 ครั้ง ตรวจสอบอินเวอร์เตอร์ผ่าน App ได้จากมือถือ SIRINX มีบริการ O&M (Operations & Maintenance) รายปีรวมอยู่ในสัญญา 5 ปีแรก`,
    },
    {
      q: `ติดตั้งโซลาร์เซลล์ใน${nameTh} ต้องขออนุญาตอะไรบ้าง?`,
      a: `สำหรับระบบขนาดเล็กถึงกลาง (ไม่เกิน 1,000 kW) ต้องขอ: 1) ใบอนุญาตก่อสร้าง (ถ้าจำเป็นตามขนาด) 2) ยื่นขอเชื่อมต่อกับ PEA/MEA เพื่อ Net Metering 3) แจ้ง กกพ. สำหรับระบบขนาดใหญ่ SIRINX ดำเนินเอกสารให้ทั้งหมด`,
    },
  ]
}

interface LocalFAQProps {
  province: Province
}

export default function LocalFAQ({ province }: LocalFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const faqs = buildFAQs(province)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="text-2xl font-bold text-white mb-6">
        คำถามที่พบบ่อย — โซลาร์เซลล์{province.nameTh}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              <span className="font-medium text-white pr-4">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-solar-gold flex-shrink-0 transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5">
                <p className="text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
