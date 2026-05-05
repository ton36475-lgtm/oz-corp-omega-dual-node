import Link from 'next/link';
import { AgentActivity } from '../components/AgentActivity';

const LAYERS = [
  { id: 'L1', name: 'Perception', count: 16, color: 'border-sky-500', textColor: 'text-sky-500', desc: 'Data input, scraping, monitoring' },
  { id: 'L2', name: 'Analysis', count: 9, color: 'border-purple-500', textColor: 'text-purple-500', desc: 'Scoring, enrichment, forecasting' },
  { id: 'L3', name: 'Decision', count: 10, color: 'border-solar-gold', textColor: 'text-solar-gold', desc: 'Proposal, generation, actions' },
  { id: 'L4', name: 'Coordination', count: 8, color: 'border-emerald-green', textColor: 'text-emerald-green', desc: 'Orchestration, pipelines, state' },
  { id: 'L5', name: 'R&D Bunker', count: 4, color: 'border-red-500', textColor: 'text-red-500', desc: 'AI trends, benchmarks, research' },
  { id: 'KAI', name: 'Chatbot Kai', count: 1, color: 'border-solar-gold', textColor: 'text-solar-gold', desc: 'Customer chatbot, 5-step CoT' },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="text-solar-gold tracking-widest uppercase text-xs mb-4">
          SIRINX Solar · AI-WarRoom
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
          47 Ronin<br />
          <span className="text-solar-gold">Multi-Agent System</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
          Solar sales &amp; operations intelligence platform for the Thai market.
          48 specialized AI agents across 5 processing layers.
        </p>
        <Link href="/agents" className="inline-block px-8 py-3 bg-gradient-to-br from-solar-gold to-orange-600 text-deep-navy font-bold text-base rounded-lg shadow-lg hover:from-orange-600 hover:to-solar-gold transition-all duration-300">
          ⚔ View 47 Agents DNA
        </Link>
      </div>

      {/* Layer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {LAYERS.map(l => (
          <div key={l.id} className={`bg-white/5 border ${l.color}/20 rounded-xl p-6`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`${l.textColor} font-bold tracking-wider uppercase text-xs`}>
                {l.id}
              </span>
              <span className={`${l.textColor}/20 ${l.textColor} font-bold text-xs px-2 py-1 rounded-full`}>
                {l.count} agents
              </span>
            </div>
            <div className="text-lg font-bold text-white mb-1">{l.name}</div>
            <div className="text-sm text-gray-500">{l.desc}</div>
          </div>
        ))}
      </div>

      {/* Agent Activity */}
      <div className="mb-12">
        <AgentActivity />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: '48', sub: '47 Ronin + Kai' },
          { label: 'MRR Target M6', value: '฿250K', sub: 'SaaS + Leads + Data' },
          { label: 'Cost vs Competitors', value: '95%↓', sub: 'SIRINX ฿2,990 vs ฿55K' },
          { label: 'AI Models', value: '4', sub: 'Claude · Qwen · GLM · Gemini' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-extrabold text-solar-gold mb-1">{s.value}</div>
            <div className="text-sm font-semibold text-white mb-0.5">{s.label}</div>
            <div className="text-xs text-gray-500">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
