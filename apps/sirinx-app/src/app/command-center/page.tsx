"use client";

import { useState } from "react";

const engines = [
  "Hermes Local LLM",
  "Codex CLI",
  "Claude Code CLI",
  "Gemini CLI",
];

const tools = [
  "GitHub Repos",
  "OpenClaw Continuity",
  "Hermes Agent",
  "Ollama Local LLM",
  "Safe Command Tool",
  "ozwarp Audit",
];

export default function CommandCenterPage() {
  const [engine, setEngine] = useState(engines[0]);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState(
    [
      "OZ-CORP Command Center ready.",
      "",
      "Cloudflare Pages serves this UI as static files only.",
      "Local dev: whitelist API routes (/api/command-center/status, /api/openclaw/run); never paste secrets here.",
      "",
      "Hermes Agent + Ollama run on your Mac/PC separately.",
    ].join("\n")
  );

  async function pingStatus() {
    try {
      const res = await fetch("/api/command-center/status", { cache: "no-store" });
      const json = await res.json();
      setOutput(JSON.stringify(json, null, 2));
    } catch (e) {
      setOutput(
        `Could not reach /api/command-center/status (expected offline on Pages static export).\n${String(e)}`
      );
    }
  }

  function queueTask() {
    setOutput(
      [
        `Engine: ${engine}`,
        "",
        "Prompt queued:",
        prompt || "(empty)",
        "",
        "Next:",
        "- Run Hermes locally and connect dashboard to your safe backend when ready.",
        "- Use Claude Code CLI with official login — do not expose API keys in this UI.",
      ].join("\n")
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-emerald-50">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6 shadow-lg">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
            OZ-CORP OMEGA
          </p>
          <h1 className="mt-2 text-3xl font-bold">Command Center</h1>
          <p className="mt-2 text-slate-300">
            Local-first dashboard for Hermes, Ollama, GitHub, Codex, Claude Code, and
            Gemini CLI.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
            <label className="block text-sm font-medium text-emerald-300">
              Engine
            </label>

            <select
              value={engine}
              onChange={(event) => setEngine(event.target.value)}
              className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-slate-950 p-3 text-emerald-50"
            >
              {engines.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="mt-6 block text-sm font-medium text-emerald-300">
              Prompt
            </label>

            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={8}
              placeholder="Describe the task..."
              className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-slate-950 p-3 text-emerald-50 placeholder:text-slate-500"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={queueTask}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Queue Task
              </button>
              <button
                type="button"
                onClick={pingStatus}
                className="rounded-xl border border-emerald-500/40 px-5 py-3 font-semibold text-emerald-200 hover:bg-emerald-950/80"
              >
                Ping API Stub
              </button>
            </div>

            <pre className="mt-6 min-h-48 whitespace-pre-wrap rounded-xl border border-emerald-500/20 bg-black p-4 text-sm text-emerald-200">
              {output}
            </pre>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">System Status</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Hermes Agent</span>
                  <span className="text-emerald-400">Local service</span>
                </div>
                <div className="flex justify-between">
                  <span>Ollama</span>
                  <span className="text-emerald-400">localhost:11434</span>
                </div>
                <div className="flex justify-between">
                  <span>Model</span>
                  <span className="text-emerald-400">llama3.2:3b</span>
                </div>
                <div className="flex justify-between">
                  <span>Production UI</span>
                  <span className="text-yellow-300">Static (Pages)</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Repos / Skills</h2>

              <div className="mt-4 grid gap-3">
                {tools.map((tool) => (
                  <div
                    key={tool}
                    className="rounded-xl border border-emerald-500/10 bg-slate-950 p-3 text-sm"
                  >
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
