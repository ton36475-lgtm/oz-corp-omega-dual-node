import { NextRequest, NextResponse } from 'next/server';
import {
  runCommandCenterTool,
  toolFromTelegramCommand,
  type CommandCenterToolName,
} from '@/lib/command-center-tools';

export const dynamic = 'force-static';

const ALLOWED_TOOLS = new Set<CommandCenterToolName>([
  'status',
  'rooms',
  'pipeline_plan',
  'utility_manifest',
  'telegram_commands',
]);

export async function GET() {
  return NextResponse.json({
    availableTools: Array.from(ALLOWED_TOOLS),
    telegramExamples: ['/status', '/rooms', '/pipeline', '/utility', '/commands'],
  });
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
  const extra = Object.keys(obj).filter((key) => !['tool', 'telegramText'].includes(key));
  if (extra.length > 0) {
    return NextResponse.json({ error: 'Unsupported fields', extra }, { status: 400 });
  }

  const requestedTool = typeof obj.tool === 'string'
    ? obj.tool
    : typeof obj.telegramText === 'string'
      ? toolFromTelegramCommand(obj.telegramText)
      : null;

  if (!requestedTool || !ALLOWED_TOOLS.has(requestedTool as CommandCenterToolName)) {
    return NextResponse.json({
      error: 'Unknown or disallowed tool',
      availableTools: Array.from(ALLOWED_TOOLS),
    }, { status: 400 });
  }

  return NextResponse.json({
    tool: requestedTool,
    result: runCommandCenterTool(requestedTool as CommandCenterToolName),
  });
}
