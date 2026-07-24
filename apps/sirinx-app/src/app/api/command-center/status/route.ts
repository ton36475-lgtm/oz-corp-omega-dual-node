import { NextResponse } from "next/server";
import { COMMAND_CENTER_ROOMS, TELEGRAM_COMMANDS } from "@/lib/command-center-tools";

export const dynamic = "force-static";

/**
 * GET /api/command-center/status
 * Safe contract surface for the Command Center UI (local dev only with `next dev`).
 * Static export / Cloudflare Pages does not ship API routes.
 */
export async function GET() {
  return NextResponse.json({
    service: "oz-corp-command-center",
    mode: "stub",
    notes: [
      "Cloudflare Pages hosts the static export; production POST APIs run in sirinx-api-worker.",
      "OpenClaw production execution must use a Worker service binding; raw shell/argv/env/cwd inputs are rejected.",
    ],
    endpoints: {
      status: "/api/command-center/status",
      tool: "/api/command-center/tool",
      openclawAllowlist: "/api/openclaw/run",
      pipelinePlan: "/api/pipeline/plan",
      workersAiServer: "/api/ai/server",
      workersAiCompute: "/api/ai/compute",
    },
    productionRuntime: {
      worker: "sirinx-api-worker",
      health: "/health",
      readiness: "/api/runtime/readiness",
      dynamicPostRoutes: [
        "/api/command-center/tool",
        "/api/pipeline/plan",
        "/api/ai/compute",
        "/api/openclaw/run",
        "/api/ai-customize",
        "/api/vision/analyze",
      ],
    },
    rooms: COMMAND_CENTER_ROOMS,
    telegramCommands: TELEGRAM_COMMANDS,
    timestamp: new Date().toISOString(),
  });
}
