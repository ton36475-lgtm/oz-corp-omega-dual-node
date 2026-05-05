'use client'

import { useState } from 'react'
import type { Province } from '@/data/provinces'

interface LeadCaptureFormProps {
  province: Province
  variant?: 'full' | 'compact'
}

interface FormState {
  name: string
  phone: string
  email: string
  businessType: string
  systemInterest: string
  monthlyBill: string
  message: string
}

const BUSINESS_TYPES = [
  'โรงงานอุตสาหกรรม',
  'คลังสินค้า / โกดัง',
  'โรงแรม / รีสอร์ท',
  'อาคารสำนักงาน',
  'ห้างสรรพสินค้า / ค้าปลีก',
  'โรงพยาบาล / คลินิก',
  'บ้านพักอาศัย',
  'เกษตรกรรม / ฟาร์ม',
  'อื่นๆ',
]

const SYSTEM_SIZES = [
  'ไม่แน่ใจ (ขอให้ช่วยประเมิน)',
  '5–30 kWp (บ้านพักอาศัย)',
  '30–100 kWp (SME / อาคารเล็ก)',
  '100–500 kWp (โรงงาน / อาคารใหญ่)',
  '500 kWp–1 MWp (โรงงานขนาดใหญ่)',
  '1 MWp ขึ้นไป (Solar Farm / โครงการใหญ่)',
]

export default function LeadCaptureForm({ province, variant = 'full' }: LeadCaptureFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    businessType: '',
    systemInterest: SYSTEM_SIZES[0],
    monthlyBill: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'กรุณากรอกชื่อ'
    if (!form.phone.trim() || !/^[0-9]{9,10}$/.test(form.phone.replace(/[-\s]/g, '')))
      e.phone = 'กรุณากรอกเบอร์โทรให้ถูกต้อง (9-10 หลัก)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')

    // TODO: connect to CRM / n8n webhook
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('success')
  }

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">ส่งข้อมูลสำเร็จ!</h3>
        <p className="text-slate-300">
          ทีม SIRINX จะติดต่อกลับภายใน 24 ชั่วโมง<br />
          เพื่อนัดสำรวจหน้างานใน{province.nameTh} ฟรี
        </p>
      </div>
    )
  }

  const inputClass = (field: keyof FormState) =>
    `w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-solar-gold transition-colors ${errors[field] ? 'border-red-500' : 'border-white/20'}`

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          ขอใบเสนอราคาฟรี — {province.nameTh}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          สำรวจหน้างานฟรี ไม่มีค่าใช้จ่าย ทีมวิศวกรตอบกลับภายใน 24 ชม.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              ชื่อ-นามสกุล <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="สมชาย ใจดี"
              value={form.name}
              onChange={set('name')}
              className={inputClass('name')}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              เบอร์โทรศัพท์ <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              placeholder="086-XXX-XXXX"
              value={form.phone}
              onChange={set('phone')}
              className={inputClass('phone')}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">อีเมล (ไม่บังคับ)</label>
            <input
              type="email"
              placeholder="example@company.com"
              value={form.email}
              onChange={set('email')}
              className={inputClass('email')}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">ค่าไฟเฉลี่ย/เดือน (บาท)</label>
            <input
              type="number"
              placeholder="100,000"
              value={form.monthlyBill}
              onChange={set('monthlyBill')}
              className={inputClass('monthlyBill')}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">ประเภทธุรกิจ</label>
            <select value={form.businessType} onChange={set('businessType')} className={inputClass('businessType')}>
              <option value="">-- เลือกประเภท --</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">ขนาดระบบที่สนใจ</label>
            <select value={form.systemInterest} onChange={set('systemInterest')} className={inputClass('systemInterest')}>
              {SYSTEM_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {variant === 'full' && (
          <div className="mt-4">
            <label className="block text-sm text-slate-300 mb-1.5">ข้อความเพิ่มเติม</label>
            <textarea
              rows={3}
              placeholder={`รายละเอียดเพิ่มเติม เช่น ขนาดหลังคา พื้นที่ใน${province.nameTh} หรือคำถาม...`}
              value={form.message}
              onChange={set('message')}
              className={`${inputClass('message')} resize-none`}
            />
          </div>
        )}

        {/* Hidden province */}
        <input type="hidden" name="province" value={province.nameTh} />
        <input type="hidden" name="provinceSlug" value={province.slug} />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="mt-6 w-full bg-gradient-to-r from-solar-gold to-yellow-400 text-deep-navy font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-60 transition-all text-lg"
        >
          {status === 'sending' ? 'กำลังส่ง...' : `ขอใบเสนอราคาฟรี — ${province.nameTh}`}
        </button>

        <p className="text-xs text-slate-500 mt-3 text-center">
          🔒 ข้อมูลของคุณปลอดภัย ไม่มีการแชร์ต่อบุคคลที่สาม
        </p>
      </form>
    </div>
  )
}
