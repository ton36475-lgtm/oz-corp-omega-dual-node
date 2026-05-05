/**
 * POST /api/vision/analyze
 *
 * Vision analysis endpoint powered by GLM-5V-Turbo (Zhipu AI).
 * Accepts base64-encoded images and returns structured analysis.
 *
 * Request body:
 * {
 *   type: "roof_analysis" | "bill_ocr" | "installation_inspection" | "site_survey" | "general"
 *   images: string[]        — base64 or data-URL encoded images (max 10)
 *   context?: {
 *     buildingType?: string
 *     location?: string
 *     systemSize?: number
 *     projectName?: string
 *   }
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   type: string
 *   content: string          — raw model output
 *   parsed: object | null    — structured JSON (for roof_analysis / bill_ocr)
 *   model: string
 *   inputTokens: number
 *   outputTokens: number
 *   costUsd: number
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { ZhipuClient, type ZhipuResponse } from '@/lib/providers/zhipu'

const MAX_IMAGES = 10

type AnalysisType =
  | 'roof_analysis'
  | 'bill_ocr'
  | 'installation_inspection'
  | 'site_survey'
  | 'general'

interface RequestBody {
  type: AnalysisType
  images: string[]
  prompt?: string
  context?: {
    buildingType?: string
    location?: string
    systemSize?: number
    projectName?: string
  }
}

function validateImages(images: unknown): images is string[] {
  return (
    Array.isArray(images) &&
    images.length > 0 &&
    images.length <= MAX_IMAGES &&
    images.every(img => typeof img === 'string' && img.length > 0)
  )
}

export async function POST(req: NextRequest) {
  // ── Parse & validate ────────────────────────────────────────────────────────
  let body: RequestBody
  try {
    body = (await req.json()) as RequestBody
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const { type = 'general', images, context = {}, prompt } = body

  if (!validateImages(images)) {
    return NextResponse.json(
      {
        success: false,
        error: `"images" must be a non-empty array of up to ${MAX_IMAGES} base64 strings`,
      },
      { status: 400 },
    )
  }

  // ── Build client ────────────────────────────────────────────────────────────
  const client = new ZhipuClient()

  if (!client.isConfigured) {
    return NextResponse.json(
      {
        success: false,
        error: 'Vision API not configured — set ZHIPU_API_KEY or OPENROUTER_API_KEY',
        hint:  'Add ZHIPU_API_KEY to .env.local and restart the dev server',
      },
      { status: 503 },
    )
  }

  // ── Dispatch to appropriate analysis method ─────────────────────────────────
  try {
    let result: ZhipuResponse
    let parsed: unknown = null

    switch (type) {
      case 'roof_analysis': {
        const { raw, parsed: p } = await client.analyzeRoof(images, {
          buildingType: context.buildingType,
          location:     context.location,
          systemSize:   context.systemSize,
        })
        result = raw
        parsed = p
        break
      }

      case 'bill_ocr': {
        const { raw, parsed: p } = await client.readElectricityBill(images[0])
        result = raw
        parsed = p
        break
      }

      case 'installation_inspection': {
        result = await client.inspectInstallation(images)
        try {
          const match = result.content.match(/\{[\s\S]*\}/)
          if (match) parsed = JSON.parse(match[0])
        } catch { /* leave parsed as null */ }
        break
      }

      case 'site_survey': {
        result = await client.analyzeSiteSurvey(images, {
          projectName: context.projectName,
          systemSize:  context.systemSize,
        })
        try {
          const match = result.content.match(/\{[\s\S]*\}/)
          if (match) parsed = JSON.parse(match[0])
        } catch { /* leave parsed as null */ }
        break
      }

      case 'general':
      default: {
        if (!prompt) {
          return NextResponse.json(
            { success: false, error: '"prompt" is required for general vision analysis' },
            { status: 400 },
          )
        }
        result = await client.generate(prompt, { images })
        break
      }
    }

    return NextResponse.json({
      success:      true,
      type,
      content:      result.content,
      parsed,
      model:        result.model,
      inputTokens:  result.inputTokens,
      outputTokens: result.outputTokens,
      costUsd:      result.costUsd,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/vision/analyze]', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
