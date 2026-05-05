// POST /api/openclaw/run
// Executes an openclaw CLI command and returns stdout/stderr
// Uses spawn to avoid Windows path/quoting issues with exec

import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

const OPENCLAW_CMD = 'C:\\Users\\Ton36\\AppData\\Roaming\\npm\\openclaw.cmd'

// Allowed commands whitelist — args split for spawn (no shell injection possible)
const ALLOWED_COMMANDS: Record<string, string[]> = {
  health:         ['health'],
  status:         ['status'],
  models:         ['models', 'status', '--json'],
  agents:         ['agents', 'list', '--json'],
  sessions:       ['sessions', '--json'],
  gateway_status: ['gateway', 'status'],
  memory_status:  ['memory', 'status'],
  skills:         ['skills', '--json'],
  models_scan:    ['models', 'scan'],
  logs:           ['logs', '--tail', '20'],
  version:        ['--version'],
}

function runOpenClaw(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    // On Windows, .cmd files require shell:true or cmd.exe /c
    // Use cmd.exe /c with the full path to avoid PATH issues
    const child = spawn('cmd.exe', ['/c', OPENCLAW_CMD, ...args], {
      shell: false,
      env: {
        ...process.env,
        PATH: `C:\\Users\\Ton36\\AppData\\Roaming\\npm;${process.env.PATH ?? ''}`,
      },
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (d: Buffer) => { stdout += d.toString() })
    child.stderr.on('data', (d: Buffer) => { stderr += d.toString() })

    child.on('close', (code) => {
      // Strip ANSI escape codes for clean output
      const stripAnsi = (s: string) => s.replace(/\x1B\[[0-9;]*[mGKHF]/g, '').trim()
      resolve({ stdout: stripAnsi(stdout), stderr: stripAnsi(stderr), code: code ?? 0 })
    })

    child.on('error', (err) => {
      resolve({ stdout: '', stderr: err.message, code: 1 })
    })
  })
}

export async function POST(req: NextRequest) {
  const { command } = await req.json() as { command: string }

  const args = ALLOWED_COMMANDS[command]
  if (!args) {
    return NextResponse.json(
      { error: `Unknown command: ${command}. Allowed: ${Object.keys(ALLOWED_COMMANDS).join(', ')}` },
      { status: 400 }
    )
  }

  const fullCmd = `openclaw ${args.join(' ')}`
  const { stdout, stderr, code } = await runOpenClaw(args)

  return NextResponse.json({
    command,
    fullCmd,
    stdout,
    stderr,
    success: code === 0,
    timestamp: new Date().toISOString(),
  })
}

export async function GET() {
  return NextResponse.json({ availableCommands: Object.keys(ALLOWED_COMMANDS) })
}
