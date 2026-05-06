import { NextResponse } from "next/server";

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
      "Cloudflare Pages hosts static export only — no /api/* on production.",
      "Run Hermes + Ollama locally; never expose shell execution to the browser.",
    ],
    endpoints: {
      status: "/api/command-center/status",
      openclawAllowlist: "/api/openclaw/run",
    },
    timestamp: new Date().toISOString(),
  });
}
