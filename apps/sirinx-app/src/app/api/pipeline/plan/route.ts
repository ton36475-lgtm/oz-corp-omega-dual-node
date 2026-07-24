import { NextRequest, NextResponse } from 'next/server';
import { createPipelinePlan, type LeadFacts } from '@/lib/sirinx-pipeline';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(createPipelinePlan());
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 });
  }

  const obj = body as Record<string, unknown>;
  const allowed = new Set([
    'businessName',
    'province',
    'monthlyBillThb',
    'roofAreaSqm',
    'serviceInterest',
    'urgency',
    'source',
  ]);
  const extra = Object.keys(obj).filter((key) => !allowed.has(key));
  if (extra.length > 0) {
    return NextResponse.json({
      error: 'Unsupported lead fact fields',
      extra,
      allowed: Array.from(allowed),
    }, { status: 400 });
  }

  return NextResponse.json(createPipelinePlan(obj as LeadFacts));
}
