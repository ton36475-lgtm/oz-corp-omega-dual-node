// SIRINX 47 Ronin — Full Agent Registry
import type { AgentConfig } from './types'

export const AGENT_DEFINITIONS: AgentConfig[] = [
  // ─── L1 Perception (16 agents) ──────────────────────────────────────────────
  { id: 'agent-01-pv-monitor',           name: 'Kuranosuke',   codename: 'kuranosuke',  roninName: '内蔵助',   roninKanji: '内蔵助', layer: 'layer1-perception', type: 'pv-monitor',              description: 'Real-time solar PV production monitoring & anomaly detection',  dependencies: [], version: '1.0.0' },
  { id: 'agent-02-battery-monitor',      name: 'Chikara',      codename: 'chikara',     roninName: '主税',     roninKanji: '主税',   layer: 'layer1-perception', type: 'battery-monitor',         description: 'Battery state-of-charge, health, and charge cycle tracking',   dependencies: [], version: '1.0.0' },
  { id: 'agent-03-weather',              name: 'Sōemon',       codename: 'soemon',      roninName: '左衛門',   roninKanji: '左衛門', layer: 'layer1-perception', type: 'weather-monitor',         description: 'Weather & solar irradiance data collection (OpenWeatherMap)',  dependencies: [], version: '1.0.0' },
  { id: 'agent-04-grid-tariff',          name: 'Gengoemon',    codename: 'gengoemon',   roninName: '源五右衛門', roninKanji: '源五右衛門', layer: 'layer1-perception', type: 'grid-tariff-monitor',  description: 'MEA/PEA grid status and real-time tariff rate monitoring',     dependencies: [], version: '1.0.0' },
  { id: 'agent-05-site-survey',          name: 'Yahei',        codename: 'yahei',       roninName: '弥兵衛',   roninKanji: '弥兵衛', layer: 'layer1-perception', type: 'site-survey',             description: 'Installation site survey data ingestion and geo-mapping',     dependencies: [], version: '1.0.0' },
  { id: 'agent-06-customer-usage',       name: 'Yasubei',      codename: 'yasubei',     roninName: '安兵衛',   roninKanji: '安兵衛', layer: 'layer1-perception', type: 'customer-usage',          description: 'Customer electricity consumption pattern collection',          dependencies: [], version: '1.0.0' },
  { id: 'agent-07-maintenance-hist',     name: 'Chūzaemon',    codename: 'chuzaemon',   roninName: '忠左衛門', roninKanji: '忠左衛門', layer: 'layer1-perception', type: 'maintenance-history',    description: 'Maintenance history log aggregation per installation',         dependencies: [], version: '1.0.0' },
  { id: 'agent-08-contractor-perf',      name: 'Sawaemon',     codename: 'sawaemon',    roninName: '沢右衛門', roninKanji: '沢右衛門', layer: 'layer1-perception', type: 'contractor-performance', description: 'Contractor rating, SLA, and job completion tracking',          dependencies: [], version: '1.0.0' },
  { id: 'agent-09-fb-group-scanner',     name: 'Kanroku',      codename: 'kanroku',     roninName: '勘六',     roninKanji: '勘六',   layer: 'layer1-perception', type: 'fb-group-scanner',        description: 'Facebook group scanning for solar leads and sentiment',        dependencies: [], version: '1.0.0' },
  { id: 'agent-10-fb-comment-scanner',   name: 'Kyūdayū',     codename: 'kyudayu',     roninName: '九太夫',   roninKanji: '九太夫', layer: 'layer1-perception', type: 'fb-comment-scanner',      description: 'Facebook ad comment lead extraction and intent scoring',       dependencies: [], version: '1.0.0' },
  { id: 'agent-11-tiktok-scanner',       name: 'Magokurō',    codename: 'magokuro',    roninName: '孫九郎',   roninKanji: '孫九郎', layer: 'layer1-perception', type: 'tiktok-scanner',          description: 'TikTok solar content monitoring and viral tracking',           dependencies: [], version: '1.0.0' },
  { id: 'agent-12-instagram-scanner',    name: 'Genzō',       codename: 'genzo',       roninName: '源蔵',     roninKanji: '源蔵',   layer: 'layer1-perception', type: 'instagram-scanner',       description: 'Instagram hashtag, reel, and story solar lead scanning',       dependencies: [], version: '1.0.0' },
  { id: 'agent-13-youtube-scanner',      name: 'Matanojō',    codename: 'matanojo',    roninName: '又之丞',   roninKanji: '又之丞', layer: 'layer1-perception', type: 'youtube-scanner',         description: 'YouTube solar channel subscriber & comment mining',            dependencies: [], version: '1.0.0' },
  { id: 'agent-14-property-scanner',     name: 'Sukeemon',     codename: 'sukeemon',    roninName: '助右衛門', roninKanji: '助右衛門', layer: 'layer1-perception', type: 'property-scanner',      description: 'Property listing scraper for rooftop solar opportunity scoring', dependencies: [], version: '1.0.0' },
  { id: 'agent-15-google-maps',          name: 'Kazuemon',     codename: 'kazuemon',    roninName: '数右衛門', roninKanji: '数右衛門', layer: 'layer1-perception', type: 'google-maps-monitor',   description: 'Google Maps business scanner for commercial solar prospects',  dependencies: [], version: '1.0.0' },
  { id: 'agent-16-multi-bot-coord',      name: "Kin'emon",     codename: 'kinemon',     roninName: '金右衛門', roninKanji: '金右衛門', layer: 'layer1-perception', type: 'multi-bot-coordinator', description: 'L1 sub-bot orchestration and deduplication coordinator',       dependencies: [], version: '1.0.0' },

  // ─── L2 Analysis (9 agents) ─────────────────────────────────────────────────
  { id: 'agent-17-degradation',          name: 'Jūnai',       codename: 'junai',       roninName: '重内',     roninKanji: '重内',   layer: 'layer2-analysis', type: 'degradation-analysis',    description: 'Solar panel degradation curve modeling and RUL prediction',    dependencies: ['agent-01-pv-monitor', 'agent-07-maintenance-hist'], version: '1.0.0' },
  { id: 'agent-18-financial-analysis',   name: 'Kōemon',      codename: 'koemon',      roninName: '幸右衛門', roninKanji: '幸右衛門', layer: 'layer2-analysis', type: 'financial-analysis',     description: 'ROI, payback period, NPV calculation for solar proposals',    dependencies: ['agent-06-customer-usage', 'agent-04-grid-tariff'], version: '1.0.0' },
  { id: 'agent-19-tax-optimization',     name: 'Okaemon',      codename: 'okaemon',     roninName: '岡右衛門', roninKanji: '岡右衛門', layer: 'layer2-analysis', type: 'tax-optimization',      description: 'Thai BOI tax incentive optimization and deduction maximizer', dependencies: ['agent-18-financial-analysis'], version: '1.0.0' },
  { id: 'agent-20-production-forecast',  name: 'Magodayū',    codename: 'magodayu',    roninName: '孫太夫',   roninKanji: '孫太夫', layer: 'layer2-analysis', type: 'production-forecasting',  description: '12-month solar production forecasting with weather correction', dependencies: ['agent-03-weather', 'agent-01-pv-monitor'], version: '1.0.0' },
  { id: 'agent-21-battery-optimizer',    name: 'Sadaemon',     codename: 'sadaemon',    roninName: '定右衛門', roninKanji: '定右衛門', layer: 'layer2-analysis', type: 'battery-optimizer',     description: 'Battery charge/discharge strategy optimization for peak tariff', dependencies: ['agent-02-battery-monitor', 'agent-04-grid-tariff'], version: '1.0.0' },
  { id: 'agent-22-low-prod-detection',   name: 'Tōzaemon',    codename: 'tozaemon',    roninName: '藤左衛門', roninKanji: '藤左衛門', layer: 'layer2-analysis', type: 'low-production-detection', description: 'Statistical anomaly detection for underperforming solar panels', dependencies: ['agent-01-pv-monitor', 'agent-03-weather'], version: '1.0.0' },
  { id: 'agent-23-cash-flow-health',     name: 'Gorōemon',    codename: 'goroemon',    roninName: '五郎右衛門', roninKanji: '五郎右衛門', layer: 'layer2-analysis', type: 'cash-flow-health',  description: 'Customer payment health scoring and churn risk prediction',   dependencies: ['agent-18-financial-analysis'], version: '1.0.0' },
  { id: 'agent-24-lead-qualification',   name: 'Sezaemon',     codename: 'sezaemon',    roninName: '瀬左衛門', roninKanji: '瀬左衛門', layer: 'layer2-analysis', type: 'lead-qualification',    description: 'BANT lead scoring (1-100) with intent and budget estimation',  dependencies: ['agent-09-fb-group-scanner', 'agent-10-fb-comment-scanner'], version: '1.0.0' },
  { id: 'agent-25-competitor-intel',     name: 'Jūrōzaemon',  codename: 'jurozaemon',  roninName: '十郎左衛門', roninKanji: '十郎左衛門', layer: 'layer2-analysis', type: 'competitor-intel',   description: 'Competitor pricing, product, and market position intelligence', dependencies: [], version: '1.0.0' },

  // ─── L3 Decision (10 agents) ────────────────────────────────────────────────
  { id: 'agent-26-proposal-gen',         name: 'Kihei',        codename: 'kihei',       roninName: '喜兵衛',   roninKanji: '喜兵衛', layer: 'layer3-decision', type: 'proposal-generator',      description: 'Full solar proposal generation in Thai with ROI tables (PDF)', dependencies: ['agent-18-financial-analysis', 'agent-20-production-forecast'], version: '1.0.0' },
  { id: 'agent-27-service-recommend',    name: 'Jūjirō',      codename: 'jujiro',      roninName: '重次郎',   roninKanji: '重次郎', layer: 'layer3-decision', type: 'service-recommender',     description: 'AI-driven service package recommendation engine',              dependencies: ['agent-24-lead-qualification', 'agent-18-financial-analysis'], version: '1.0.0' },
  { id: 'agent-28-job-posting',          name: 'Shinrokurō',  codename: 'shinrokuro',  roninName: '新六郎',   roninKanji: '新六郎', layer: 'layer3-decision', type: 'job-posting-agent',       description: 'Auto-post installation jobs to contractor marketplace',        dependencies: ['agent-05-site-survey'], version: '1.0.0' },
  { id: 'agent-29-bid-evaluation',       name: 'Kansuke',      codename: 'kansuke',     roninName: '勘助',     roninKanji: '勘助',   layer: 'layer3-decision', type: 'bid-evaluator',            description: 'Contractor bid scoring: price, rating, availability, distance', dependencies: ['agent-08-contractor-perf', 'agent-28-job-posting'], version: '1.0.0' },
  { id: 'agent-30-promotion-engine',     name: 'Saburobei',    codename: 'saburobei',   roninName: '三郎兵衛', roninKanji: '三郎兵衛', layer: 'layer3-decision', type: 'promotion-engine',      description: 'Dynamic promotion and discount engine based on lead score',   dependencies: ['agent-24-lead-qualification', 'agent-25-competitor-intel'], version: '1.0.0' },
  { id: 'agent-31-notification',         name: 'Hannojō',     codename: 'hannojo',     roninName: '半之丞',   roninKanji: '半之丞', layer: 'layer3-decision', type: 'notification-agent',      description: 'Multi-channel notifications: LINE OA, SMS, email, push',      dependencies: [], version: '1.0.0' },
  { id: 'agent-32-verification',         name: 'Muramatsu-Kihei', codename: 'muramatsu', roninName: '村松喜兵衛', roninKanji: '村松喜兵衛', layer: 'layer3-decision', type: 'verification-agent', description: 'Output quality verification and confidence scoring',         dependencies: [], version: '1.0.0' },
  { id: 'agent-33-content-request',      name: 'Sandayū',     codename: 'sandayu',     roninName: '三太夫',   roninKanji: '三太夫', layer: 'layer3-decision', type: 'content-request-agent',   description: 'Social media content brief generation for marketing team',     dependencies: ['agent-11-tiktok-scanner', 'agent-12-instagram-scanner'], version: '1.0.0' },
  { id: 'agent-34-email-marketing',      name: 'Densuke',      codename: 'densuke',     roninName: '傳助',     roninKanji: '傳助',   layer: 'layer3-decision', type: 'email-marketing-agent',   description: 'Personalized email campaign creation with Thai copywriting',   dependencies: ['agent-24-lead-qualification', 'agent-26-proposal-gen'], version: '1.0.0' },
  { id: 'agent-43-security',             name: 'Yasoemon',     codename: 'yasoemon',    roninName: '弥惣右衛門', roninKanji: '弥惣右衛門', layer: 'layer3-decision', type: 'security-agent',    description: 'API access control, rate limiting, anomaly detection',        dependencies: [], version: '1.0.0' },

  // ─── L4 Coordination (8 agents) ─────────────────────────────────────────────
  { id: 'agent-35-orchestrator',         name: 'Gengo',        codename: 'gengo',       roninName: '源吾',     roninKanji: '源吾',   layer: 'layer4-coordination', type: 'orchestrator',           description: '★ Master orchestrator — end-to-end pipeline coordination',    dependencies: ['agent-24-lead-qualification', 'agent-26-proposal-gen', 'agent-31-notification'], version: '1.0.0' },
  { id: 'agent-36-customer-portal',      name: 'Emoshichi',    codename: 'emoshichi',   roninName: '右衛門七', roninKanji: '右衛門七', layer: 'layer4-coordination', type: 'customer-portal-agent', description: 'Customer portal data sync: proposals, invoices, status',      dependencies: ['agent-35-orchestrator'], version: '1.0.0' },
  { id: 'agent-37-core-dashboard',       name: 'Shinzaemon',   codename: 'shinzaemon',  roninName: '新左衛門', roninKanji: '新左衛門', layer: 'layer4-coordination', type: 'core-dashboard-agent', description: 'Admin dashboard real-time KPI aggregation and refresh',       dependencies: ['agent-35-orchestrator'], version: '1.0.0' },
  { id: 'agent-38-contractor-portal',    name: 'Tadashichi',   codename: 'tadashichi',  roninName: '忠七',     roninKanji: '忠七',   layer: 'layer4-coordination', type: 'contractor-portal-agent', description: 'Contractor job dispatch, tracking, and payment pipeline',    dependencies: ['agent-29-bid-evaluation'], version: '1.0.0' },
  { id: 'agent-39-growth-acq',           name: 'Isuke',        codename: 'isuke',       roninName: '伊助',     roninKanji: '伊助',   layer: 'layer4-coordination', type: 'growth-acquisition-agent', description: 'Growth & acquisition: referral, upsell, expansion triggers', dependencies: ['agent-23-cash-flow-health'], version: '1.0.0' },
  { id: 'agent-40-decision-router',      name: 'Yazaemon',     codename: 'yazaemon',    roninName: '弥左衛門', roninKanji: '弥左衛門', layer: 'layer4-coordination', type: 'decision-router',       description: 'Smart routing of decisions to correct L3 agent pipelines',    dependencies: ['agent-35-orchestrator'], version: '1.0.0' },
  { id: 'agent-41-state-manager',        name: 'Jūheiji',     codename: 'juheiji',     roninName: '重平次',   roninKanji: '重平次', layer: 'layer4-coordination', type: 'state-manager',           description: 'Supabase-backed distributed state management for pipelines',  dependencies: [], version: '1.0.0' },
  { id: 'agent-42-learning-optim',       name: 'Yogorō',      codename: 'yogoro',      roninName: '与五郎',   roninKanji: '与五郎', layer: 'layer4-coordination', type: 'learning-optimization',   description: 'RL-based continuous learning from sales and outcome signals',  dependencies: ['agent-35-orchestrator'], version: '1.0.0' },

  // ─── L5 R&D (4 agents) ──────────────────────────────────────────────────────
  { id: 'agent-44-ai-trend-scanner',     name: 'Mimura',       codename: 'mimura',      roninName: '三村',     roninKanji: '三村',   layer: 'layer5-research', type: 'ai-trend-scanner',         description: 'Weekly AI/ML model trend scanning from GitHub, HuggingFace, arXiv', dependencies: [], version: '1.0.0' },
  { id: 'agent-45-code-evolution',       name: 'Yokogawa',     codename: 'yokogawa',    roninName: '横川',     roninKanji: '横川',   layer: 'layer5-research', type: 'code-evolution',            description: 'Dependency health, best-practice upgrade proposals for codebase', dependencies: [], version: '1.0.0' },
  { id: 'agent-46-benchmark-research',   name: 'Kayano',       codename: 'kayano',      roninName: '萱野',     roninKanji: '萱野',   layer: 'layer5-research', type: 'benchmark-research',        description: 'Lighthouse, API p99, DB, and competitor performance benchmarks', dependencies: [], version: '1.0.0' },
  { id: 'agent-47-integration-disc',     name: 'Terasaka',     codename: 'terasaka',    roninName: '寺坂',     roninKanji: '寺坂',   layer: 'layer5-research', type: 'integration-discovery',     description: 'New MCP/API integration discovery and opportunity scoring',   dependencies: [], version: '1.0.0' },

  // ─── Chatbot ─────────────────────────────────────────────────────────────────
  { id: 'chatbot-kai',                   name: 'Kai',          codename: 'kai',         roninName: '甲斐',     roninKanji: '甲斐',   layer: 'chatbot',         type: 'chatbot',                   description: 'Customer-facing AI chatbot with 5-step CoT qualification',    dependencies: ['agent-24-lead-qualification', 'agent-26-proposal-gen'], version: '1.0.0' },
]

export function getAgentById(id: string): AgentConfig | undefined {
  return AGENT_DEFINITIONS.find(a => a.id === id)
}

export function getAgentByCodename(codename: string): AgentConfig | undefined {
  return AGENT_DEFINITIONS.find(a => a.codename === codename)
}

export function getAgentsByLayer(layer: AgentConfig['layer']): AgentConfig[] {
  return AGENT_DEFINITIONS.filter(a => a.layer === layer)
}

export const LAYER_ORDER: AgentConfig['layer'][] = [
  'layer1-perception',
  'layer2-analysis',
  'layer3-decision',
  'layer4-coordination',
  'layer5-research',
  'chatbot',
]
