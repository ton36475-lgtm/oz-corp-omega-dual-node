// POST /api/openclaw/run
// Whitelist-only OpenClaw CLI invocation. No shell, no user-provided argv.
// Set OPENCLAW_EXECUTABLE to the full path of `openclaw` (or `openclaw.cmd` on Windows).

import type { ChildProcess } from "child_process";
import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

const ALLOWED_COMMANDS: Record<string, string[]> = {
  health: ["health"],
  status: ["status"],
  models: ["models", "status", "--json"],
  agents: ["agents", "list", "--json"],
  sessions: ["sessions", "--json"],
  gateway_status: ["gateway", "status"],
  memory_status: ["memory", "status"],
  skills: ["skills", "--json"],
  models_scan: ["models", "scan"],
  logs: ["logs", "--tail", "20"],
  version: ["--version"],
};

function getExecutable(): string | null {
  const raw =
    process.env.OPENCLAW_EXECUTABLE?.trim() ||
    process.env.OPENCLAW_CMD?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function runOpenClaw(args: string[]): Promise<{
  stdout: string;
  stderr: string;
  code: number;
}> {
  const exe = getExecutable();
  if (!exe) {
    return Promise.resolve({
      stdout: "",
      stderr:
        "OPENCLAW_EXECUTABLE is not set. Add it to .env.local (local dev only).",
      code: 1,
    });
  }

  return new Promise((resolve) => {
    const isWin = process.platform === "win32";
    const useCmdWrapper =
      isWin && exe.toLowerCase().endsWith(".cmd");

    let child: ChildProcess;
    if (useCmdWrapper) {
      child = spawn("cmd.exe", ["/c", exe, ...args], {
        shell: false,
        env: process.env,
      });
    } else {
      child = spawn(exe, args, { shell: false, env: process.env });
    }

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (d: Buffer) => {
      stdout += d.toString();
    });
    child.stderr?.on("data", (d: Buffer) => {
      stderr += d.toString();
    });

    child.on("close", (code) => {
      const stripAnsi = (s: string) =>
        s.replace(/\x1B\[[0-9;]*[mGKHF]/g, "").trim();
      resolve({
        stdout: stripAnsi(stdout),
        stderr: stripAnsi(stderr),
        code: code ?? 0,
      });
    });

    child.on("error", (err) => {
      resolve({ stdout: "", stderr: err.message, code: 1 });
    });
  });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Body must be a JSON object" },
      { status: 400 }
    );
  }

  const obj = body as Record<string, unknown>;
  const disallowedFields = [
    "argv",
    "args",
    "shell",
    "raw",
    "script",
    "cmdline",
    "commandLine",
    "env",
    "cwd",
    "stdio",
    "exec",
    "stdin",
  ];
  for (const key of disallowedFields) {
    if (key in obj) {
      return NextResponse.json(
        { error: `Field "${key}" is not permitted` },
        { status: 400 }
      );
    }
  }

  const unknownKeys = Object.keys(obj).filter((k) => k !== "command");
  if (unknownKeys.length > 0) {
    return NextResponse.json(
      { error: "Only \"command\" is allowed", extra: unknownKeys },
      { status: 400 }
    );
  }

  const command = obj.command;
  if (typeof command !== "string" || !command.trim()) {
    return NextResponse.json(
      { error: "command must be a non-empty string" },
      { status: 400 }
    );
  }

  const exe = getExecutable();
  if (!exe) {
    const ts = new Date().toISOString();
    return NextResponse.json(
      {
        command,
        fullCmd: "(not executed — OPENCLAW_EXECUTABLE unset)",
        stdout: "",
        stderr:
          "Set OPENCLAW_EXECUTABLE in .env.local to your openclaw binary (local dev only).",
        success: false,
        timestamp: ts,
        hint: `Allowed presets: ${Object.keys(ALLOWED_COMMANDS).join(", ")}`,
      },
      { status: 503 }
    );
  }

  const args = ALLOWED_COMMANDS[command];
  if (!args) {
    const ts = new Date().toISOString();
    return NextResponse.json(
      {
        command,
        fullCmd: "(not executed — unknown preset)",
        stdout: "",
        stderr: `Unknown command: ${command}`,
        success: false,
        timestamp: ts,
      },
      { status: 400 }
    );
  }

  const { stdout, stderr, code } = await runOpenClaw(args);
  const fullCmd = `openclaw ${args.join(" ")}`;

  return NextResponse.json({
    command,
    fullCmd,
    stdout,
    stderr,
    success: code === 0,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    availableCommands: Object.keys(ALLOWED_COMMANDS),
    configured: Boolean(getExecutable()),
    hint: "Set OPENCLAW_EXECUTABLE for local CLI runs (never commit paths with secrets).",
  });
}
