# CLAUDE.md

Guidance for AI coding assistants (Claude Code and similar) working in this repository.

## What this project is

**oz-corp-omega-dual-node** (package name `thcludecode-manager`, internal codename "OZ-CORP OMEGA") is a
pnpm monorepo for the SIRINX solar-energy AI platform plus its supporting local-agent
infrastructure ("thClaw Orchestrator" / "Hermes"). "Dual-Node" refers to two recurring
architectural splits used across the repo:

1. **Static frontend + dynamic API worker.** `apps/sirinx-app` builds as a static Next.js
   export (`output: "export"`, no server) and calls out to `services/sirinx-api-worker`
   (a separate Cloudflare Worker) for any POST/dynamic behavior, because a static export
   cannot run Next.js route handlers in production.
2. **Local-first + cloud-fallback LLM routing.** `services/hermes-agent`'s
   `AdaptiveA2ARouter` prefers a local Ollama model and falls back to a cloud provider
   (Grok) when local generation fails or is unavailable — "local node" and "cloud node".

The repo is a working consolidation of several previously separate projects ("Mac Old Work
Migration", see `docs/MAC_OLD_WORK_MIGRATION.md`) rather than a from-scratch app, so
expect some rough edges, duplicated/legacy config, and docs that describe aspirational
("Pillar 1–4") work plans rather than only current state.

## Directory structure (top levels)

```
apps/
  sirinx-app/           Canonical Next.js 15 web app (static export), port 3002 in dev
  solar-dashboard/       Small Cloudflare Worker/Pages app (wrangler.toml)
  clawhub-apple/         Swift/SwiftUI scaffold (ClawHubCore + ClawHubApp), Apple-platform client
packages/
  ui-components/         Shared React component library (peer dep react@19)
  thclaws-math/          Small standalone TS math helpers (e.g. Kelly criterion, solar pricing)
services/
  sirinx-api-worker/     Cloudflare Worker: dynamic /api/* backend for sirinx-app (wrangler.jsonc)
  hermes-agent/          Local Node/tsx agent: LLM routing (Ollama/Grok), safe command tools, memory
  hermes-warroom/        Python predictive analytics (Kanban bottleneck/completion prediction)
  openclaw-worker/       Python orchestrator simulating multi-worker task distribution over MCP
                          clients (meta_ads, context7, deepseek_v4, supabase)
  n8n_workflows/          Sample n8n workflow JSON
  telegram-command-bot/  Node script bridging Telegram bot commands to the command center
  docker-compose.yml      n8n + MongoDB stack (with optional Cloudflare Tunnel profile)
infrastructure/
  local-mcp-network/      Docker Compose for a local MCP gateway network
  orbstack/                OrbStack helper script/readme (local container runtime on macOS)
scripts/                  Orchestration/automation scripts (Manus API/Codex integration,
                           MongoDB aggregation, Discord/Telegram sync, skill sync) — mostly
                           Python and shell, mostly not wired into CI
security/                 Security guardrails docs (see Gotchas — some referenced scripts
                           in security/README.md do not exist in the repo)
knowledge/obsidian/       Obsidian vault used as a knowledge base (kanban, security, a2a notes)
kanban/clawhub.json       Kanban board data (backlog/ready/in_progress/review columns)
docs/                     Design/process docs (MillerDev prompt pack, monorepo pack, migration
                           notes, token/agent pipeline) — mix of specs and after-the-fact notes
mkt-brain/                QA pattern docs (code review / API integration / test-case checklists)
```

`apps/sirinx-app/src/agents/` implements the "47 Ronin" multi-agent system (agent-01 through
agent-47, each in its own folder) — see Architecture below.

## Setup

```sh
pnpm install            # root install; pnpm-workspace.yaml covers apps/*, packages/*,
                         # services/*, infrastructure/*, scripts/*
```

- Package manager is pinned via `packageManager: pnpm@10.33.3` in root `package.json`.
- `services/hermes-agent/.nvmrc` specifies Node 22 for that service.
- Both `package-lock.json` and `pnpm-lock.yaml` exist at the root — **pnpm is the real
  workspace tool**; treat `package-lock.json` as stale/vestigial and don't add to it.
- No root `node_modules` is checked in; run `pnpm install` before anything else.

### Environment variables

No root `.env.example`. Per-project examples that do exist:

- `apps/sirinx-app/.env.local.example` — copy to `apps/sirinx-app/.env.local`. The app
  works without any keys set (mock-data mode). Notable vars: `NEXT_PUBLIC_SIRINX_API_BASE_URL`
  (origin of the deployed `sirinx-api-worker`, required for dynamic POST APIs since the app
  is statically exported), `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` /
  `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `XAI_API_KEY`, `ZHIPU_API_KEY` /
  `ZHIPU_BASE_URL`, `OPENROUTER_API_KEY`, `OPENCLAW_API_KEY` / `OPENCLAW_EXECUTABLE`.
- `infrastructure/local-mcp-network/.env.example` — `N8N_BASIC_AUTH_USER/PASSWORD`,
  `N8N_ENCRYPTION_KEY`, `MCP_GATEWAY_PORT`, `MCP_N8N_PORT`, `MCP_REDIS_PORT`.
- `services/sirinx-api-worker/wrangler.jsonc` declares a required secret
  `SIRINX_AI_SERVER_TOKEN` (set via `wrangler secret put`, not in a file) and vars
  `SIRINX_API_MODE`, `SIRINX_ALLOWED_ORIGIN`, `SIRINX_WORKERS_AI_MODEL`.
- `services/docker-compose.yml` reads `N8N_HOST`, `N8N_BASIC_AUTH_USER/PASSWORD`,
  `WEBHOOK_URL`, `GENERIC_TIMEZONE`, `MONGO_INITDB_ROOT_USERNAME/PASSWORD` from a
  `services/.env` file (see README's optional Cloudflare Tunnel section).

Never print or commit actual secret values — see **Critical security note** below.

## Dev / build / test / lint commands

There is no top-level lint or single "build everything" script; work per-workspace with
pnpm's `--filter` (or `-C`), or run the root smoke script.

**Root**

```sh
pnpm test               # alias for test:real-use
pnpm test:real-use      # full cross-workspace check, runs in order:
                         #   sirinx-api-worker test, sirinx-api-worker check (tsc),
                         #   sirinx-app test:api-runtime, sirinx-app typecheck, sirinx-app build,
                         #   sirinx-app smoke:static, @oz-corp/hermes-agent check, ui-components test
```

**apps/sirinx-app** (Next.js 15, static export, port 3002)

```sh
pnpm -C apps/sirinx-app dev            # next dev --turbopack -p 3002
pnpm -C apps/sirinx-app build          # next build -> static export in out/
pnpm -C apps/sirinx-app start          # serves out/ via scripts/serve-static-export.mjs
pnpm -C apps/sirinx-app smoke:static   # scripts/smoke-static-export.mjs
pnpm -C apps/sirinx-app typecheck      # tsc --noEmit
pnpm -C apps/sirinx-app lint           # next lint
pnpm -C apps/sirinx-app test:api-runtime  # node --test src/lib/api-runtime.test.ts
```

**services/sirinx-api-worker** (Cloudflare Worker, wrangler)

```sh
pnpm -C services/sirinx-api-worker dev            # wrangler dev --local --port 8787
pnpm -C services/sirinx-api-worker check           # tsc --noEmit
pnpm -C services/sirinx-api-worker test            # node --test src/**/*.test.ts via tsx
pnpm -C services/sirinx-api-worker deploy:dry-run  # wrangler deploy --dry-run (never run real deploy without approval)
```

**services/hermes-agent** (local Node agent)

```sh
pnpm -C services/hermes-agent dev     # tsx src/index.ts
pnpm -C services/hermes-agent check   # tsc --noEmit
```

**packages/ui-components**

```sh
pnpm -C packages/ui-components build  # tsc --project tsconfig.json
pnpm -C packages/ui-components test   # tsc --noEmit (type-check only, no runtime test framework)
```

**Python services** (`services/openclaw-worker`, `services/hermes-warroom`, most of `scripts/`)

No shared virtualenv or requirements.txt at the root. `services/openclaw-worker/README.md`
documents its own manual flow: create a venv, `pip install python-dotenv`, `python orchestrator.py`.
Treat other top-level Python scripts (`scripts/manus_api_orchestrator.py`,
`scripts/mongodb_aggregator.py`, etc.) the same way — check each script's header/imports for
its actual dependencies before running.

**No CI workflows exist** (`.github/workflows` is absent) — there is nothing enforcing these
commands automatically; run them yourself before calling work done.

## Architecture / conventions actually used

- **47 Ronin agent system** (`apps/sirinx-app/src/agents/`): every agent extends
  `BaseAgent` (`base-agent.ts`), which wraps `process()` with `agent.started` /
  `agent.completed` / `agent.failed` events published via a shared `eventBus`
  (`event-bus.ts`), timing, and a standard `AgentOutput` envelope
  (`success/data/error/processingMs/confidence/correlationId/timestamp`). Concrete agents
  only need to implement `protected async process(input): Promise<Record<string, unknown>>`.
  Agents are organized into layers (perception/analysis/decision/coordination/research —
  see `agent-definitions.ts` and `data/agent-dna-data.ts`) and are looked up through
  `agent-factory.ts`. This mirrors the same 47-Ronin pattern used in the sibling
  `sirinx-app`/`sirinx-os` repos on this machine — keep agent numbering/layer conventions
  consistent if cross-referencing.
- **Static export + separate dynamic worker split**: `apps/sirinx-app/next.config.mjs`
  sets `output: "export"` and `images.unoptimized: true`. `src/lib/api-runtime.ts`
  (`buildDynamicApiUrl`, `normalizeApiPath` — paths must start with `/api/`) is the
  single seam that decides whether to call a relative path or
  `NEXT_PUBLIC_SIRINX_API_BASE_URL` + path. Any new dynamic (POST) functionality belongs in
  `services/sirinx-api-worker`, not as a Next.js route handler in `sirinx-app`, since the
  static export can't execute those in production. There's a second, non-canonical
  `next.config.ts` in the same folder (`reactStrictMode: true`, no `output: "export"`) —
  `next.config.mjs` is the one Next.js actually loads; don't assume `.ts` config is live.
- **Adaptive local/cloud LLM routing** (`services/hermes-agent/src/llm/adaptive-router.ts`):
  `AdaptiveA2ARouter` picks Ollama (local) or Grok (cloud) based on `HERMES_LLM_MODE` env
  var or an explicit `preferredProvider`, and falls back to the other provider on failure.
  `sendA2A` wraps agent-to-agent messages in a fixed JSON envelope
  (`protocol/fromAgent/toAgent/intent/payload`).
- **Worker/task simulation with self-healing** (`services/openclaw-worker/orchestrator.py`):
  distributes tasks to simulated MCP clients (`meta_ads`, `context7`, `deepseek_v4`,
  `supabase`); on MCP failure a worker records `error_count`/`last_error`, clears
  `current_task`, and returns to `idle` rather than stalling — preserve this
  error-recovery behavior if you touch that file, it was a deliberate deadlock fix.
  README's "Fix" section documents the exact prior bug.
- Every `apps/*`, `packages/*`, and `services/*` folder with a `package.json` is a pnpm
  workspace member — `pnpm -C <path> <script>` targets it directly, no extra wiring needed.
- Cloudflare deployments (`services/sirinx-api-worker`, `apps/solar-dashboard`) use
  `account_id` values committed in `wrangler.jsonc`/`wrangler.toml`. Never run a real
  `wrangler deploy` (only `deploy:dry-run`) without explicit human approval — this mirrors
  the "do not deploy without approval" rule already used in the sibling `sirinx-os` repo.

## Gotchas

- **CRITICAL — committed private SSH key.** The repo root has two tracked files with
  unusual names: a literal tab character (`\t`) and `\t.pub`. The `\t` file is a raw
  **OpenSSH private key** (`-----BEGIN OPENSSH PRIVATE KEY-----`), committed directly into
  git history at the repo root. Do not read/print/copy its contents (already partially
  exposed in tool output when this analysis was done — flag this to a human). Treat that
  key as compromised: it needs to be rotated/revoked and scrubbed from git history by a
  human with repo-admin access; this is out of scope for a docs-only change and was not
  altered here. Also add safer `.gitignore` coverage (currently `.gitignore` only excludes
  `*.key`/`*.pem`/`*.p12`, which would not have caught this tab-named file).
- **`security/README.md` documents tooling that doesn't exist.** It references
  `security/secret-scan.sh`, `security/put-secret.sh`, `security/secret-status.sh`,
  `security/run-with-secrets.sh`, and `security/secrets.local.example.env` — none of these
  files exist in the repo (only `security/README.md` and `security/hardening-checklist.md`
  are present). Don't assume the secret scanner referenced in docs (and in
  `docs/MONOREPO_PACK.md`'s "Run Checks" section) actually runs anywhere; it doesn't, which
  is presumably how the private key above ended up committed.
- **Two lockfiles, one real workspace tool.** `package-lock.json` and `pnpm-lock.yaml` both
  exist at root; the workspace is pnpm-driven (`pnpm-workspace.yaml`, `packageManager` field).
  Update `pnpm-lock.yaml` when changing dependencies; don't rely on npm.
- **`apps/sirinx-app` has two Next.js configs** (`next.config.mjs` and `next.config.ts`).
  Next.js loads `.mjs` first, so `output: "export"` (mjs) is what actually applies, not the
  `reactStrictMode` one in the `.ts` file. Consolidate carefully if asked to touch Next config.
  `apps/sirinx-app` also ships `tailwind.config.js` **and** `tailwind.config.ts`, and
  `postcss.config.js` **and** `postcss.config.mjs` — same duplication pattern; check which
  file is actually picked up before editing styling config, and prefer removing the dead one
  over adding a third. Note also that its `package.json` lists Tailwind
  `^4.0.0-alpha.16`, while a similarly-named `sirinx-app` in the separate
  `sirinx-solar-energy` repo on this machine is pinned to Tailwind v3.4.1 — these are two
  different checkouts of a similar app; don't assume conventions/CLAUDE.md rules from one
  apply unmodified to the other.
- **No root-level lint/format command.** Linting exists only inside `apps/sirinx-app`
  (`next lint`); other workspaces only offer type-checking (`tsc --noEmit`) as their
  closest equivalent to a lint gate.
- **No CI.** There's no `.github/workflows` directory, so `pnpm test` / `typecheck` /
  `build` must be run manually — nothing will catch a broken build automatically.
- **Docs describe a plan, not just current state.** Files like
  `apps/sirinx-app/README.md` (Pillar 1 plan), `STRESS_TEST_REPORT.md`, and
  `skills/oz-corp-omega-builder-advanced/SKILL.md` read as forward-looking build plans /
  self-reported test reports rather than strictly factual descriptions of what's currently
  wired up (e.g. the stress-test report claims things like "100% data integrity" and
  "production-level deployment ready" that aren't independently verifiable from the repo
  alone). Cross-check claims in these docs against actual code before relying on them.
- **Python scripts have no shared dependency management.** No root `requirements.txt` /
  `pyproject.toml` / virtualenv config; each Python script/service documents (or doesn't)
  its own deps inline. Check imports before assuming a script "just works".
- Do not deploy, push, mutate cloud resources, send real messages (Telegram/Discord/etc.),
  expose local services publicly, or touch real secrets without explicit human approval —
  same standing rule as the sibling `sirinx-os` repo's `AGENTS.md`.
