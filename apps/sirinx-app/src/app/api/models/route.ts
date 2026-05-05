// GET /api/models — list available AI models
// Detects local models (OpenClaw, HiClaw, Ollama, LM Studio) + cloud providers

import { NextResponse } from 'next/server'

// Cloud providers — availability determined by env vars (no network probe needed)
const CLOUD_PROVIDERS = [
  {
    id:       'grok-3',
    name:     'Grok 3',
    provider: 'xAI · ACTIVE',
    url:      'https://api.x.ai/v1',
    models:   ['grok-3', 'grok-3-fast', 'grok-3-mini'],
    envKey:   'XAI_API_KEY',
    capabilities: ['code_generation', 'creative_content_th', 'research', 'real_time_web'],
    contextWindow: 131072,
    pricing:  { input: 3.00, output: 15.00, unit: 'USD/1M tokens' },
  },
  {
    id:       'gemini-2.0-flash',
    name:     'Gemini 2.0 Flash',
    provider: 'Google AI · PRIMARY',
    url:      'https://generativelanguage.googleapis.com/v1beta',
    models:   ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    envKey:   'GOOGLE_GEMINI_API_KEY',
    fallbackEnvKey: 'GOOGLE_API_KEY',
    capabilities: ['multimodal', 'long_context', 'image_prompt', 'translation', 'code_generation'],
    contextWindow: 1000000,
    pricing:  { input: 0.10, output: 0.40, unit: 'USD/1M tokens' },
  },
  {
    id:       'glm-5v-turbo',
    name:     'GLM-5V-Turbo',
    provider: 'Zhipu AI · Vision',
    url:      'https://open.bigmodel.cn/api/paas/v4',
    models:   ['glm-5v-turbo'],
    envKey:   'ZHIPU_API_KEY',
    fallbackEnvKey: 'OPENROUTER_API_KEY',
    capabilities: ['vision', 'function_calling', 'long_context'],
    contextWindow: 200000,
    pricing:  { input: 1.20, output: 4.00, unit: 'USD/1M tokens' },
  },
]

const LOCAL_MODEL_ENDPOINTS = [
  { id: 'openclaw',  name: 'OpenClaw',  url: 'http://127.0.0.1:11434', tagsPath: '/api/tags'    },
  { id: 'hiclaw',   name: 'HiClaw',   url: 'http://127.0.0.1:11435', tagsPath: '/api/tags'    },
  { id: 'ollama',   name: 'Ollama',   url: 'http://127.0.0.1:11434', tagsPath: '/api/tags'    },
  { id: 'lmstudio', name: 'LM Studio', url: 'http://127.0.0.1:1234',  tagsPath: '/v1/models'  },
]

async function probeEndpoint(url: string, tagsPath: string): Promise<{ online: boolean; models: string[] }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1500)
    const res = await fetch(`${url}${tagsPath}`, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return { online: false, models: [] }
    const data = await res.json() as Record<string, unknown>
    // Ollama format: { models: [{ name }] }
    // OpenAI-compat format: { data: [{ id }] }
    const models: string[] = []
    if (Array.isArray(data.models)) {
      for (const m of data.models as Array<{ name: string }>) models.push(m.name)
    } else if (Array.isArray(data.data)) {
      for (const m of data.data as Array<{ id: string }>) models.push(m.id)
    }
    return { online: true, models }
  } catch {
    return { online: false, models: [] }
  }
}

export async function GET() {
  // Probe local endpoints
  const localResults = await Promise.all(
    LOCAL_MODEL_ENDPOINTS.map(async ep => {
      const probe = await probeEndpoint(ep.url, ep.tagsPath)
      return {
        ...ep,
        status: probe.online ? 'connected' : 'offline',
        models: probe.models,
        provider: `Local · ${ep.url.split(':')[2]}`,
        type: 'local',
      }
    })
  )
  // Dedupe same port (ollama/openclaw both at 11434 — show only first online)
  const seen = new Set<string>()
  const deduped = localResults.filter(r => {
    const port = r.url.split(':')[2]
    if (r.status === 'connected' && seen.has(port)) return false
    if (r.status === 'connected') seen.add(port)
    return true
  })

  // Cloud providers — check env vars (server-side only, keys never exposed)
  const cloudResults = CLOUD_PROVIDERS.map(cp => ({
    id:           cp.id,
    name:         cp.name,
    url:          cp.url,
    provider:     cp.provider,
    models:       cp.models,
    capabilities: cp.capabilities,
    contextWindow: cp.contextWindow,
    pricing:      cp.pricing,
    status:       (process.env[cp.envKey] || process.env[cp.fallbackEnvKey ?? ''])
                    ? 'connected'
                    : 'no_key',
    type:         'cloud',
  }))

  return NextResponse.json({
    models:    [...deduped, ...cloudResults],
    scannedAt: new Date().toISOString(),
  })
}
