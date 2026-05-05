'use client'
import { useState } from 'react'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass" style={{ marginBottom: 20, overflow: 'hidden' }}>
      <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>{title}</h3>
      </div>
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  )
}

function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, gap: 24 }}>
      <div style={{ flex: '0 0 200px' }}>
        <div style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{desc}</div>}
      </div>
      <div style={{ flex: 1, maxWidth: 360 }}>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: value ? '#F5A623' : 'rgba(255,255,255,0.08)',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3,
          left: value ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: value ? '#0A1628' : '#64748B',
          transition: 'left 0.2s',
        }} />
      </button>
      {label && <span style={{ fontSize: 13, color: value ? '#F5A623' : '#64748B' }}>{label}</span>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '9px 12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 8, color: '#E2E8F0', fontSize: 13,
        outline: 'none', boxSizing: 'border-box',
      }}
    />
  )
}

export default function SettingsPage() {
  // Company
  const [companyName, setCompanyName] = useState('SIRINX Solar Energy Co., Ltd.')
  const [companyTax, setCompanyTax] = useState('0105566012345')
  const [companyPhone, setCompanyPhone] = useState('02-123-4567')
  const [companyEmail, setCompanyEmail] = useState('contact@sirinx.co.th')
  const [companyAddress, setCompanyAddress] = useState('123 ถ.สุขุมวิท เขตวัฒนา กรุงเทพ 10110')

  // Agent Config
  const [agentL1, setAgentL1] = useState(true)
  const [agentL2, setAgentL2] = useState(true)
  const [agentL3, setAgentL3] = useState(true)
  const [agentL4, setAgentL4] = useState(true)
  const [agentL5, setAgentL5] = useState(true)
  const [agentKai, setAgentKai] = useState(true)
  const [autoAssign, setAutoAssign] = useState(true)
  const [autoProposal, setAutoProposal] = useState(false)

  // Notifications
  const [notifyNewLead, setNotifyNewLead] = useState(true)
  const [notifyWon, setNotifyWon] = useState(true)
  const [notifyLost, setNotifyLost] = useState(false)
  const [notifyTelegram, setNotifyTelegram] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyLine, setNotifyLine] = useState(false)

  // API Keys (masked)
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [showSupabaseKey, setShowSupabaseKey] = useState(false)
  const [showOpenclawKey, setShowOpenclawKey] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: '28px 32px', background: '#0A1628', minHeight: '100vh' }}>
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.3px' }}>Settings</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#475569' }}>
            ตั้งค่าระบบ SIRINX AI-WarRoom
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{
            padding: '9px 24px',
            background: saved ? '#10B981' : '#F5A623',
            border: 'none', borderRadius: 8, color: '#0A1628',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ บันทึกแล้ว' : 'บันทึกการตั้งค่า'}
        </button>
      </div>

      <div style={{ maxWidth: 760 }}>
        {/* Company Profile */}
        <Section title="ข้อมูลบริษัท">
          <Field label="ชื่อบริษัท">
            <TextInput value={companyName} onChange={setCompanyName} placeholder="ชื่อบริษัท" />
          </Field>
          <Field label="เลขที่ผู้เสียภาษี">
            <TextInput value={companyTax} onChange={setCompanyTax} placeholder="13 หลัก" />
          </Field>
          <Field label="เบอร์โทรศัพท์">
            <TextInput value={companyPhone} onChange={setCompanyPhone} placeholder="0x-xxx-xxxx" />
          </Field>
          <Field label="อีเมล">
            <TextInput value={companyEmail} onChange={setCompanyEmail} placeholder="email@company.com" type="email" />
          </Field>
          <Field label="ที่อยู่">
            <textarea
              value={companyAddress}
              onChange={e => setCompanyAddress(e.target.value)}
              rows={2}
              style={{
                width: '100%', padding: '9px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 8, color: '#E2E8F0', fontSize: 13,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </Field>
        </Section>

        {/* Agent Configuration */}
        <Section title="ตั้งค่า Agent">
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: '#475569', marginBottom: 14, padding: '8px 12px', background: 'rgba(245,166,35,0.06)', borderRadius: 8, border: '1px solid rgba(245,166,35,0.12)' }}>
              เปิด/ปิด Agent แต่ละชั้น — การปิด Layer จะหยุดการทำงานของ Agent ทั้ง Layer นั้น
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'L1 Perception (16 agents)', value: agentL1, setter: setAgentL1, desc: 'สแกน, มอนิเตอร์, รวบรวมข้อมูล' },
                { label: 'L2 Analysis (9 agents)', value: agentL2, setter: setAgentL2, desc: 'วิเคราะห์, คำนวณ, ให้คะแนน' },
                { label: 'L3 Decision (10 agents)', value: agentL3, setter: setAgentL3, desc: 'กลยุทธ์, ตัดสินใจ, สร้างข้อเสนอ' },
                { label: 'L4 Coordination (8 agents)', value: agentL4, setter: setAgentL4, desc: 'ประสานงาน, รันโปรเจกต์' },
                { label: 'L5 Research (4 agents)', value: agentL5, setter: setAgentL5, desc: 'R&D, benchmark, trend analysis' },
                { label: 'Kai Chatbot', value: agentKai, setter: setAgentKai, desc: 'Customer-facing AI assistant' },
              ].map(({ label, value, setter, desc }) => (
                <div key={label} style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                  border: `1px solid ${value ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: value ? '#CBD5E1' : '#475569' }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>{desc}</div>
                  </div>
                  <Toggle value={value} onChange={setter} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
            <Field label="Auto-assign Lead" desc="ให้ Agent คัดกรอง Lead อัตโนมัติ">
              <Toggle value={autoAssign} onChange={setAutoAssign} label={autoAssign ? 'เปิดใช้งาน' : 'ปิดใช้งาน'} />
            </Field>
            <Field label="Auto Proposal" desc="สร้างใบเสนอราคาอัตโนมัติเมื่อ Lead ผ่านการคัดกรอง">
              <Toggle value={autoProposal} onChange={setAutoProposal} label={autoProposal ? 'เปิดใช้งาน' : 'ปิดใช้งาน'} />
            </Field>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="การแจ้งเตือน">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12, fontWeight: 600 }}>ประเภทการแจ้งเตือน</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Lead ใหม่เข้าระบบ', value: notifyNewLead, setter: setNotifyNewLead },
                { label: 'ปิดการขายสำเร็จ', value: notifyWon, setter: setNotifyWon },
                { label: 'Lead ไม่สำเร็จ', value: notifyLost, setter: setNotifyLost },
              ].map(({ label, value, setter }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#CBD5E1' }}>{label}</span>
                  <Toggle value={value} onChange={setter} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12, fontWeight: 600 }}>ช่องทางแจ้งเตือน</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: '📱 Telegram Bot', value: notifyTelegram, setter: setNotifyTelegram },
                { label: '✉️ Email', value: notifyEmail, setter: setNotifyEmail },
                { label: '💬 Line Notify', value: notifyLine, setter: setNotifyLine },
              ].map(({ label, value, setter }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#CBD5E1' }}>{label}</span>
                  <Toggle value={value} onChange={setter} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* API Keys */}
        <Section title="API Keys">
          <div style={{ marginBottom: 10, padding: '8px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.15)', fontSize: 12, color: '#FCA5A5' }}>
            ⚠️ ห้ามแชร์ API Keys กับผู้อื่น — เก็บไว้ในไฟล์ .env.local เท่านั้น
          </div>

          {[
            { label: 'Anthropic API Key', placeholder: 'sk-ant-api03-...', show: showAnthropicKey, setShow: setShowAnthropicKey, value: 'sk-ant-api03-••••••••••••••••••••••••' },
            { label: 'Supabase Service Key', placeholder: 'eyJhbGc...', show: showSupabaseKey, setShow: setShowSupabaseKey, value: 'eyJhbGciOiJIUzI1NiIs••••••••••' },
            { label: 'OpenClaw API Key', placeholder: 'openclaw-...', show: showOpenclawKey, setShow: setShowOpenclawKey, value: 'openclaw-••••••••••••' },
          ].map(({ label, placeholder, show, setShow, value }) => (
            <Field key={label} label={label}>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  defaultValue={value}
                  readOnly
                  placeholder={placeholder}
                  style={{
                    width: '100%', padding: '9px 40px 9px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, color: '#64748B', fontSize: 13,
                    outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={() => setShow(!show)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0,
                  }}
                >
                  {show ? '🙈' : '👁'}
                </button>
              </div>
            </Field>
          ))}

          <Field label="OpenClaw Endpoint" desc="WebSocket gateway URL">
            <TextInput value="ws://127.0.0.1:18789" onChange={() => {}} />
          </Field>
          <Field label="Supabase URL" desc="Project URL">
            <TextInput value="https://••••••••.supabase.co" onChange={() => {}} />
          </Field>
        </Section>
      </div>
    </div>
  )
}
