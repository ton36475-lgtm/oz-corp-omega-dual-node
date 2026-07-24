import Link from 'next/link';
import { AGENT_DNA, LAYER_COLORS } from '@/data/agent-dna-data';
import { PIPELINE_STAGES } from '@/lib/sirinx-pipeline';

const characterAgents = ['agent-35-orchestrator', 'agent-26-proposal-gen', 'agent-24-lead-qualification', 'agent-05-site-survey']
  .map((id) => AGENT_DNA.find((agent) => agent.id === id))
  .filter((agent): agent is NonNullable<typeof agent> => Boolean(agent));

const heroMetrics = [
  { value: '5-7 ปี', label: 'ระยะเวลาคืนทุนโดยประมาณ' },
  { value: '25 ปี', label: 'อายุการรับประกันแผง' },
  { value: '48', label: 'AI agents ดูแล pipeline' },
];

const services = [
  {
    title: 'Solar Rooftop EPC',
    label: 'Factory / Warehouse',
    body: 'สำรวจ ออกแบบ ติดตั้ง และดูแลระบบโซลาร์สำหรับธุรกิจที่มีค่าไฟสูงกว่า 50,000 บาทต่อเดือน',
  },
  {
    title: 'ESS Battery Control',
    label: 'Peak Shaving',
    body: 'วางแผนแบตเตอรี่เพื่อกด peak demand, สำรองโหลดสำคัญ และจัดการพลังงานนอกช่วงแดด',
  },
  {
    title: 'EV Charging Hub',
    label: 'Fleet / Retail',
    body: 'ออกแบบจุดชาร์จรถไฟฟ้าสำหรับองค์กร โรงแรม โกดัง และพื้นที่เชิงพาณิชย์',
  },
  {
    title: 'AI Energy WarRoom',
    label: 'Monitor / Optimize',
    body: 'ใช้ agent, role, token budget และ n8n sub-pipeline เพื่อจัดการ lead, proposal, monitoring และ report',
  },
];

const pipeline = PIPELINE_STAGES.slice(0, 4).map((stage, index) => ({
  step: String(index + 1).padStart(2, '0'),
  name: stage.label,
  owner: stage.primaryAgentId,
  budget: `${stage.budgetTokens.toLocaleString()} tokens`,
  flow: stage.outputContract,
}));

const proofPoints = [
  'Thai-first copy, Sarabun typography, industrial B2B tone',
  'Token-controlled agent roles for predictable AI cost',
  'n8n-ready flow shape: trigger, enrich, score, propose, approve',
  'Built for static export so sirinx.co can be restored quickly',
];

export default function HomePage() {
  return (
    <div className="sirinx-site">
      <section className="sirinx-hero">
        <div className="sirinx-hero__content">
          <p className="sirinx-kicker">SIRINX Smart Energy Hub · Phitsanulok Thailand</p>
          <h1>ลดค่าไฟโรงงานด้วย Solar, ESS และ AI Operations ที่ควบคุมได้จริง</h1>
          <p className="sirinx-hero__lead">
            แพลตฟอร์มพลังงานอัจฉริยะสำหรับธุรกิจไทยที่รวมงาน EPC, battery storage,
            EV charging และ 48-agent WarRoom เพื่อเปลี่ยนข้อมูลหน้างานให้เป็นข้อเสนอที่ขายได้
            ติดตั้งได้ และวัดผลได้
          </p>

          <div className="sirinx-actions">
            <Link href="/calculator" className="sirinx-button sirinx-button--primary">
              คำนวณ ROI ฟรี
            </Link>
            <Link href="/solar" className="sirinx-button sirinx-button--ghost">
              ดูบริการโซลาร์
            </Link>
          </div>

          <div className="sirinx-metrics" aria-label="SIRINX energy metrics">
            {heroMetrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sirinx-hero__visual" aria-label="Industrial solar rooftop design preview">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=85"
            alt="Solar panels on a commercial rooftop under warm sunlight"
          />
          <div className="sirinx-energy-card">
            <span>Live Energy Stack</span>
            <strong>Solar + ESS + EV + AI</strong>
            <div className="sirinx-energy-bars" aria-hidden="true">
              <i style={{ height: '78%' }} />
              <i style={{ height: '46%' }} />
              <i style={{ height: '62%' }} />
              <i style={{ height: '88%' }} />
              <i style={{ height: '54%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="sirinx-section sirinx-section--tight">
        <div className="sirinx-section__header">
          <p className="sirinx-kicker">Real Design System</p>
          <h2>บริการที่ลูกค้าเข้าใจ ส่วนระบบหลังบ้านให้ agent จัดการ</h2>
        </div>
        <div className="sirinx-service-grid">
          {services.map((service) => (
            <article key={service.title} className="sirinx-service">
              <span>{service.label}</span>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sirinx-section sirinx-split">
        <div>
          <p className="sirinx-kicker">Token Managed Pipeline</p>
          <h2>วาง agent, role และ sub-pipeline ให้คิดน้อยลงแต่แม่นขึ้น</h2>
          <p>
            โครงนี้ลดการใช้ token ด้วยการแยกงานเป็น role เฉพาะทาง: intake อ่านสั้น,
            intelligence ดึงข้อมูลที่จำเป็น, proposal ใช้ context ที่สรุปแล้ว และ human approval
            ตรวจเฉพาะความเสี่ยงก่อนส่งลูกค้า
          </p>
          <ul className="sirinx-proof-list">
            {proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="sirinx-pipeline">
          {pipeline.map((item) => (
            <article key={item.step} className="sirinx-pipeline__item">
              <div className="sirinx-pipeline__step">{item.step}</div>
              <div>
                <div className="sirinx-pipeline__meta">
                  <span>{item.owner}</span>
                  <span>{item.budget}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.flow}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sirinx-section sirinx-character-system">
        <div className="sirinx-section__header">
          <div>
            <p className="sirinx-kicker">Agent Character Creator</p>
            <h2>ใช้ DNA ตัวละครแบบเกม เพื่อทำให้ทุก agent จำ role, budget และ style ของตัวเอง</h2>
          </div>
          <p>
            ข้อมูลจาก `agent-dna-data.ts` ถูกใช้เป็น character sheet: codename, layer, mission,
            personality, token budget, model, trigger และ output format. หน้า `/agents`
            คือ command center สำหรับดูตัวละครทั้งหมดแบบละเอียด
          </p>
        </div>

        <div className="sirinx-character-grid">
          {characterAgents.map((agent) => {
            const color = LAYER_COLORS[agent.layer] ?? '#94A3B8';
            return (
              <article key={agent.id} className="sirinx-character-card" style={{ '--agent-color': color } as React.CSSProperties}>
                <div className="sirinx-character-card__top">
                  <span>{agent.layerLabel}</span>
                  <strong>#{String(agent.number).padStart(2, '0')}</strong>
                </div>
                <div className="sirinx-character-card__kanji">{agent.roninKanji}</div>
                <h3>{agent.displayName}</h3>
                <p>{agent.role}</p>
                <div className="sirinx-character-card__stats">
                  <span>{agent.tokenBudget.toLocaleString()} tokens</span>
                  <span>{agent.llmModel}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="sirinx-character-link">
          <Link href="/agents" className="sirinx-button sirinx-button--ghost">
            เปิด Agent DNA Command Center
          </Link>
        </div>
      </section>

      <section className="sirinx-section sirinx-cta">
        <div>
          <p className="sirinx-kicker">Bring sirinx.co back</p>
          <h2>หน้าแรกพร้อมต่อยอดเป็นเว็บขายจริง, dashboard จริง และ automation จริง</h2>
          <p>
            เริ่มจาก public website ที่น่าเชื่อถือ แล้วต่อเข้ากับ calculator, lead capture,
            proposal generator, n8n approval flow และ WarRoom monitoring.
          </p>
        </div>
        <div className="sirinx-contact">
          <span>LINE: @sirinx-energy</span>
          <span>Tel: 065-624-9453</span>
          <span>Web: sirinx.co.th</span>
          <span>Location: Phitsanulok, Thailand</span>
        </div>
      </section>
    </div>
  );
}
