/**
 * Zhipu AI — GLM-5V-Turbo client (OpenAI-compatible)
 *
 * Supports: vision (base64 images), function calling, long context (~200K tokens)
 * Direct API:  https://open.bigmodel.cn/api/paas/v4/
 * OpenRouter:  https://openrouter.ai/api/v1  →  z-ai/glm-5v-turbo
 * Pricing:     $1.20/M input · $4.00/M output
 *
 * Solar use cases built-in:
 *   analyzeRoof()          — rooftop photo → solar potential JSON
 *   readElectricityBill()  — MEA/PEA bill photo → usage/cost JSON
 *   inspectInstallation()  — install photos → QC report JSON
 *   analyzeSiteSurvey()    — site photos → survey report JSON
 */

export const ZHIPU_BASE_URL     = 'https://open.bigmodel.cn/api/paas/v4'
export const ZHIPU_ALT_BASE_URL = 'https://api.z.ai/api/paas/v4'
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export const GLM_MODEL_DIRECT     = 'glm-5v-turbo'
export const GLM_MODEL_OPENROUTER = 'z-ai/glm-5v-turbo'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ZhipuConfig {
  apiKey?: string
  baseUrl?: string
  openrouterApiKey?: string
  /** Default model to use. Defaults to glm-5v-turbo (direct) or z-ai/glm-5v-turbo (OpenRouter) */
  defaultModel?: string
}

export interface VisionMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | ContentPart[]
}

export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }

export interface ZhipuTool {
  name: string
  description?: string
  parameters?: Record<string, unknown>
}

export interface ZhipuGenerateOptions {
  system?: string
  model?: string
  tools?: ZhipuTool[]
  temperature?: number
  maxTokens?: number
  images?: string[]  // base64 or data-URL strings
}

export interface ZhipuResponse {
  content: string
  model: string
  inputTokens: number
  outputTokens: number
  costUsd: number
  toolCalls?: Array<{ id: string; name: string; input: Record<string, unknown> }>
  finishReason?: string
}

export interface RoofAnalysis {
  roofArea: { total: number; usable: number; unit: string }
  orientation: { direction: string; tiltAngle: number }
  obstructions: Array<{ type: string; impact: 'low' | 'medium' | 'high' }>
  roofCondition: { material: string; estimatedAge: number; strength: 'good' | 'fair' | 'poor' }
  solarPotential: { estimatedKwp: number; annualKwh: number; suitabilityScore: number }
  recommendations: string[]
  notes: string
}

export interface BillData {
  meterNumber: string | null
  customerName: string | null
  billingPeriod: { from: string; to: string } | null
  consumption: {
    currentKwh: number | null
    monthlyHistory: Array<{ month: string; kwh: number }>
  }
  charges: {
    energyCharge: number | null
    ftCharge: number | null
    vatAmount: number | null
    totalTHB: number | null
  }
  avgCostPerKwh: number | null
  tariffType: 'residential' | 'sme' | 'industrial' | 'tou' | null
  utility: 'MEA' | 'PEA' | 'other' | null
  readConfidence: 'high' | 'medium' | 'low'
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

const PRICING: Record<string, { input: number; output: number }> = {
  'glm-5v-turbo':      { input: 1.20, output: 4.00 },
  'z-ai/glm-5v-turbo': { input: 1.20, output: 4.00 },
}

function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const rates = PRICING[model] ?? { input: 1.20, output: 4.00 }
  return (inputTokens * rates.input + outputTokens * rates.output) / 1_000_000
}

// ─── Client ──────────────────────────────────────────────────────────────────

export class ZhipuClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly openrouterApiKey: string
  private readonly useOpenRouter: boolean
  readonly defaultModel: string

  constructor(config: ZhipuConfig = {}) {
    this.apiKey           = config.apiKey           ?? process.env.ZHIPU_API_KEY          ?? ''
    this.openrouterApiKey = config.openrouterApiKey ?? process.env.OPENROUTER_API_KEY      ?? ''
    this.useOpenRouter    = !this.apiKey && Boolean(this.openrouterApiKey)
    this.baseUrl          = this.useOpenRouter
      ? OPENROUTER_BASE_URL
      : (config.baseUrl ?? process.env.ZHIPU_BASE_URL ?? ZHIPU_BASE_URL)
    this.defaultModel     = config.defaultModel
      ?? (this.useOpenRouter ? GLM_MODEL_OPENROUTER : GLM_MODEL_DIRECT)
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey || this.openrouterApiKey)
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.useOpenRouter ? this.openrouterApiKey : this.apiKey}`,
    }
    if (this.useOpenRouter) {
      headers['HTTP-Referer'] = 'https://sirinx.ai'
      headers['X-Title']      = 'SIRINX Solar AI Platform'
    }
    return headers
  }

  private resolveModel(override?: string): string {
    return override ?? this.defaultModel
  }

  private buildVisionContent(prompt: string, imageBase64s: string[]): ContentPart[] {
    const parts: ContentPart[] = imageBase64s.map(b64 => ({
      type: 'image_url' as const,
      image_url: {
        url: b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}`,
      },
    }))
    parts.push({ type: 'text', text: prompt })
    return parts
  }

  // ── Core generate ──────────────────────────────────────────────────────────

  async generate(prompt: string, options: ZhipuGenerateOptions = {}): Promise<ZhipuResponse> {
    if (!this.isConfigured) {
      throw new Error('ZhipuClient: no API key configured (set ZHIPU_API_KEY or OPENROUTER_API_KEY)')
    }

    const model = this.resolveModel(options.model)

    const messages: VisionMessage[] = []
    if (options.system) {
      messages.push({ role: 'system', content: options.system })
    }

    // Vision or text user message
    if (options.images?.length) {
      messages.push({
        role:    'user',
        content: this.buildVisionContent(prompt, options.images),
      })
    } else {
      messages.push({ role: 'user', content: prompt })
    }

    // Convert tools to OpenAI format
    const tools = options.tools?.map(t => ({
      type:     'function',
      function: {
        name:        t.name,
        description: t.description ?? '',
        parameters:  t.parameters  ?? { type: 'object', properties: {} },
      },
    }))

    const body: Record<string, unknown> = {
      model,
      messages,
      max_tokens:  options.maxTokens  ?? 4096,
      temperature: options.temperature ?? 0.7,
    }
    if (tools?.length) body.tools = tools

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method:  'POST',
      headers: this.buildHeaders(),
      body:    JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Zhipu API ${res.status}: ${err}`)
    }

    const data = await res.json() as {
      choices: Array<{
        message: {
          content?: string
          tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }>
        }
        finish_reason?: string
      }>
      usage?: { prompt_tokens: number; completion_tokens: number }
      model?: string
    }

    const choice      = data.choices[0]
    const content     = choice?.message?.content ?? ''
    const inputTokens  = data.usage?.prompt_tokens     ?? 0
    const outputTokens = data.usage?.completion_tokens ?? 0

    const toolCalls = choice?.message?.tool_calls?.map(tc => ({
      id:    tc.id,
      name:  tc.function.name,
      input: (() => { try { return JSON.parse(tc.function.arguments) } catch { return {} } })(),
    }))

    return {
      content,
      model,
      inputTokens,
      outputTokens,
      costUsd:     estimateCostUsd(model, inputTokens, outputTokens),
      toolCalls,
      finishReason: choice?.finish_reason,
    }
  }

  // ── Solar vision helpers ───────────────────────────────────────────────────

  /**
   * Analyze rooftop from photos — returns structured RoofAnalysis JSON.
   * ประเมิน Solar Potential จากรูปถ่ายหลังคา
   */
  async analyzeRoof(
    imageBase64s: string[],
    context: { buildingType?: string; location?: string; systemSize?: number } = {},
  ): Promise<{ raw: ZhipuResponse; parsed: RoofAnalysis | null }> {
    const ctxLines = [
      context.buildingType && `ประเภทอาคาร: ${context.buildingType}`,
      context.location     && `ที่ตั้ง: ${context.location}`,
      context.systemSize   && `ขนาดระบบที่ต้องการ: ${context.systemSize} kWp`,
    ].filter(Boolean).join('\n')

    const prompt = `วิเคราะห์หลังคาจากภาพเพื่อประเมิน Solar Potential ตอบเป็น JSON เท่านั้น:

{
  "roofArea": { "total": number, "usable": number, "unit": "sqm" },
  "orientation": { "direction": string, "tiltAngle": number },
  "obstructions": [{ "type": string, "impact": "low|medium|high" }],
  "roofCondition": { "material": string, "estimatedAge": number, "strength": "good|fair|poor" },
  "solarPotential": { "estimatedKwp": number, "annualKwh": number, "suitabilityScore": number },
  "recommendations": [string],
  "notes": string
}

${ctxLines}`

    const raw = await this.generate(prompt, {
      images:      imageBase64s,
      system:      'คุณเป็นผู้เชี่ยวชาญด้าน Solar EPC พร้อม Vision AI สำหรับวิเคราะห์หลังคาและประเมิน solar potential',
      temperature: 0.2,
      maxTokens:   2048,
    })

    let parsed: RoofAnalysis | null = null
    try {
      const match = raw.content.match(/\{[\s\S]*\}/)
      if (match) parsed = JSON.parse(match[0]) as RoofAnalysis
    } catch { /* leave parsed as null */ }

    return { raw, parsed }
  }

  /**
   * OCR + parse Thai electricity bill (MEA/PEA).
   * อ่านใบแจ้งหนี้ค่าไฟฟ้า
   */
  async readElectricityBill(
    imageBase64: string,
  ): Promise<{ raw: ZhipuResponse; parsed: BillData | null }> {
    const prompt = `อ่านและสกัดข้อมูลจากใบแจ้งหนี้ค่าไฟฟ้า (MEA/PEA) ตอบเป็น JSON เท่านั้น:

{
  "meterNumber": string | null,
  "customerName": string | null,
  "billingPeriod": { "from": string, "to": string } | null,
  "consumption": {
    "currentKwh": number | null,
    "monthlyHistory": [{ "month": string, "kwh": number }]
  },
  "charges": {
    "energyCharge": number | null,
    "ftCharge": number | null,
    "vatAmount": number | null,
    "totalTHB": number | null
  },
  "avgCostPerKwh": number | null,
  "tariffType": "residential|sme|industrial|tou" | null,
  "utility": "MEA|PEA|other" | null,
  "readConfidence": "high|medium|low"
}

หากอ่านค่าไม่ออกให้ใส่ null`

    const raw = await this.generate(prompt, {
      images:      [imageBase64],
      system:      'คุณเป็น OCR AI ผู้เชี่ยวชาญด้านใบแจ้งหนี้ MEA/PEA ของประเทศไทย',
      temperature: 0.1,
      maxTokens:   1024,
    })

    let parsed: BillData | null = null
    try {
      const match = raw.content.match(/\{[\s\S]*\}/)
      if (match) parsed = JSON.parse(match[0]) as BillData
    } catch { /* leave parsed as null */ }

    return { raw, parsed }
  }

  /**
   * QC inspection of solar installation photos.
   * ตรวจสอบคุณภาพการติดตั้ง Solar
   */
  async inspectInstallation(imageBase64s: string[]): Promise<ZhipuResponse> {
    const prompt = `ตรวจสอบคุณภาพการติดตั้ง Solar Cell จากภาพ ตอบเป็น JSON เท่านั้น:

{
  "panelAlignment":   { "score": number, "notes": string },
  "mountingRacking":  { "score": number, "notes": string },
  "wiring":           { "score": number, "notes": string },
  "inverterSetup":    { "score": number, "notes": string },
  "overallScore":     number,
  "issues": [
    { "severity": "critical|major|minor", "component": string, "description": string, "action": string }
  ],
  "passesQC":        boolean,
  "recommendations": [string]
}`

    return this.generate(prompt, {
      images:      imageBase64s,
      system:      'คุณเป็น Solar Installation Inspector ผ่านการอบรม TÜV/IEC มีประสบการณ์ตรวจสอบงาน EPC ไทย',
      temperature: 0.2,
      maxTokens:   2048,
    })
  }

  /**
   * Analyze site survey photos for project planning.
   * วิเคราะห์ภาพ Site Survey
   */
  async analyzeSiteSurvey(
    imageBase64s: string[],
    surveyData: { projectName?: string; systemSize?: number } = {},
  ): Promise<ZhipuResponse> {
    const ctxLines = [
      surveyData.projectName && `โครงการ: ${surveyData.projectName}`,
      surveyData.systemSize  && `ขนาดระบบ: ${surveyData.systemSize} kWp`,
    ].filter(Boolean).join('\n')

    const prompt = `วิเคราะห์ภาพ Site Survey สำหรับโครงการ Solar ตอบเป็น JSON เท่านั้น:

{
  "siteSuitability":       { "score": number, "summary": string },
  "structuralNotes":       string,
  "accessibilityNotes":    string,
  "specialRequirements":   [string],
  "riskFactors": [{ "risk": string, "impact": "cost|timeline|safety", "mitigation": string }],
  "layoutRecommendation":  string,
  "estimatedInstallDays":  number | null,
  "additionalNotes":       string
}

${ctxLines}`

    return this.generate(prompt, {
      images:      imageBase64s,
      system:      'คุณเป็น Solar Project Engineer ผู้เชี่ยวชาญ Site Assessment สำหรับโครงการ EPC ในไทย',
      temperature: 0.3,
      maxTokens:   2048,
    })
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _client: ZhipuClient | null = null

export function getZhipuClient(config?: ZhipuConfig): ZhipuClient {
  if (!_client || config) {
    _client = new ZhipuClient(config)
  }
  return _client
}
