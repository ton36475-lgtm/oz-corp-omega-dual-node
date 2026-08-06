# QA Engineering Dispatch Report — OZ-CORP-MONOREPO

**Date:** 2026-08-06
**Engine:** SIRINX QA Engineering Fleet (jcode coordinator + fleet workers)
**Scope:** Database functions, API routes, full function tests with graph coverage, Cloudflare Worker, Next.js app, Supabase service layer.

---

## 1. Systems Tested

| Surface | Path | Type | Production? |
|---|---|---|---|
| sirinx-api-worker | `services/sirinx-api-worker/src/index.ts` | Cloudflare Worker API | Yes |
| sirinx-app routes | `apps/sirinx-app/src/app/api/**/route.ts` | Next.js dev-only stubs | No (static export; worker is prod) |
| Supabase service layer | `apps/sirinx-app/src/services/*.ts` | DB client services | Yes (via app) |
| App libs | `src/lib/supabase.ts`, `sirinx-pipeline.ts`, `command-center-tools.ts`, `api-runtime.ts`, `providers/zhipu.ts`, `seed-check.ts` | Shared logic | Yes |

## 2. Route → Handler → Function Graph

### Worker (`sirinx-api-worker`)
```
OPTIONS (any path)                → 204 + CORS headers
GET  /health                      → jsonResponse (mode, routes list)
GET  /api/runtime/readiness       → handleRuntimeReadiness → checks 6 bindings → missing[]
GET  /api/ai/server               → handleWorkersAiServer → workersAiModel
POST /api/ai/compute              → handleWorkersAiCompute → readJsonObject → validateAiServerAccess → timingSafeEqual → workersAiInput → env.AI.run → extractWorkersAiText
GET  /api/command-center/tool     → availableTools list
POST /api/command-center/tool     → readJsonObject → toolFromTelegramCommand → runCommandCenterTool (switch 5 tools)
GET  /api/pipeline/plan           → createPipelinePlan()
POST /api/pipeline/plan           → readJsonObject → normalizeLeadFacts → createPipelinePlan → getAgentProfile
GET  /api/openclaw/run            → availableCommands
POST /api/openclaw/run            → blocked-field scan → allowlist lookup → env.OPENCLAW_SERVICE.fetch
POST /api/ai-customize            → readJsonObject → model gateway fetch → localOfficeFallback
POST /api/vision/analyze          → readJsonObject → validateImages → callVisionProvider → buildVisionPrompt → parseJsonFromText → estimateVisionCost
404 anything else
```
Helpers: `sanitizeText`, `safeNumber`, `clampInteger`, `clampNumber`, `corsHeaders`, `withCors`, `methodNotAllowed`, `readJsonObject`, `isRecord`, `bearerToken`, `normalizePath`.

### Next.js app routes (dev stubs)
```
GET  /api/command-center/status   → COMMAND_CENTER_ROOMS + TELEGRAM_COMMANDS (static)
GET  /api/models                  → probeEndpoint (local) + CLOUD_PROVIDERS env check
POST /api/ai-customize            → MODEL_URLS lookup → fetch local model → localFallback
GET/POST /api/command-center/tool → runCommandCenterTool / toolFromTelegramCommand
POST /api/openclaw/run            → spawn openclaw with allowlisted args (no shell, no raw argv)
GET/POST /api/pipeline/plan       → createPipelinePlan / normalizeLeadFacts
POST /api/vision/analyze          → ZhipuClient (analyzeRoof, readElectricityBill, inspectInstallation, analyzeSiteSurvey, generate)
```

### Supabase services (7 files)
`leads.ts`, `customers.ts`, `installations.ts`, `contractors.ts`, `campaigns.ts`, `metrics.ts`, `agents.ts` — each with CRUD + summary functions, mock fallback when unconfigured.

## 3. Coverage Matrix

### Supabase service layer — 26 new tests (all pass)
Added `src/services/__tests__/services.test.ts` (run via `npm run test:services` with tsx path-alias resolution, mock mode).

| Service | Functions covered |
|---|---|
| leads | getLeads (all, status, province, limit, offset, offset+limit), getLeadById, createLead defaults, updateLead + missing throw, deleteLead, getLeadsCount, getLeadsByStatus |
| customers | getCustomers, getCustomerById, createCustomer defaults, updateCustomer + missing throw, getTotalMRR |
| installations | getInstallations (status filter), getInstallationById, createInstallation defaults, updateInstallation + missing throw, getInstallationsByProvince |
| contractors | getContractors (province membership), getContractorById, createContractor defaults, updateContractor + missing throw |
| campaigns | getCampaigns (status filter), getCampaignById, createCampaign defaults, updateCampaign + missing throw, getCampaignSummary aggregation |
| metrics | getLatestMetric, getMetricHistory, recordMetric defaults, getDashboardKPIs fixture |
| agents | getAgentTasks (status/layer/name/limit), createAgentTask defaults, updateAgentTask + missing throw, completeAgentTask, getAgentTaskSummary |

### App libs (pipeline + command center) — 10 new tests (all pass)
Added `src/lib/__tests__/pipeline-command-center.test.ts`: sanitizer strip of script/style/full tags, safe defaults, number clamping, stage-ready logic, missing-fact reporting, unknown-agent guard, command-center tool mapping and shapes, TELEGRAM_COMMANDS consistency, LeadFacts round-trip.

### App API route handlers — 12 new tests (all pass)
Added `src/app/api/__tests__/api-routes.test.ts`. Calls each exported GET/POST handler directly with `NextRequest` under tsx (`--test-force-exit` because the abort timers in ai-customize/models would otherwise hold the process open).

| Route | Cases covered |
|---|---|
| command-center/status GET | static contract shape |
| command-center/tool GET/POST | tool list, by-tool, by-telegram-text, unknown 400, malformed JSON 400, non-object 400, extra fields 400 |
| pipeline/plan GET/POST | default plan, script-strip sanitization, stage readiness, extra fields 400 |
| ai-customize POST | unknown model 400, fallback when model unreachable, malformed JSON 400, missing prompt 400 |
| openclaw/run GET/POST | command list, blocked argv field 400, unknown command 400, no-executable 503 |
| vision/analyze POST | empty/too-many images 400, missing prompt 400, malformed JSON 400, no-key 503, provider call with parsed JSON |
| models GET | local endpoints offline + cloud providers, no throw |

### Worker routes — baseline 9 tests → final 37 tests (all pass)

| Route | Cases covered |
|---|---|
| /health | GET, trailing slash, CORS origin, wildcard origin fallback |
| /api/runtime/readiness | missing bindings, all bindings ready, wildcard origin |
| /api/ai/server | unconfigured, configured |
| /api/ai/compute | no binding 503, no token 503, auth 401/403, x-header auth, valid run, empty prompt 400, oversize 413, non-@cf model 400, extra fields 400, binding error 502 |
| /api/command-center/tool | GET list, POST by tool, POST by telegramText, unknown tool 400, extra fields 400, DELETE 405 |
| /api/pipeline/plan | GET default, POST valid, POST extra fields 400, HTML sanitization, number clamping, script-block stripping |
| /api/openclaw/run | GET allowlist, blocked fields (argv/env), extra fields, unknown command, no binding 503, service binding forward (models args) |
| /api/ai-customize | missing prompt 400, Thai presets (ทุก/park/L1/L2/L3/L4/L5/kai/gengo/error/success), unknown fallback, gateway URL, gateway failure fallback |
| /api/vision/analyze | invalid images, missing prompt for general, 11 images 400, oversized image 400, no provider key 503, Zhipu direct, OpenRouter routing, base64 data URL, cost estimate |
| global | OPTIONS 204, 404 unknown path, 405 + Allow on 8 routes, invalid JSON 400, non-object body 400, oversized body 413, timing-safe auth |

### App libs — baseline 4 tests → final 10 tests (all pass)
- `api-runtime.ts`: base/path normalization (4)
- `providers/zhipu.ts`: OpenRouter routing + headers, direct Zhipu routing, unconfigured throw, 429 error surfacing, tool-call parsing incl. malformed JSON, roof JSON parse (6)

### Static checks
- `tsc --noEmit` (worker): clean
- `tsc --noEmit` (app): clean
- `npm run build` (app): 103/103 pages, export 3/3, compile OK
- `npm run smoke:static`: passed
- `wrangler deploy --dry-run`: valid, 39.02 KiB upload, AI binding + vars listed

## 4. Bugs Found & Fixed

| # | Severity | Location | Description | Fix |
|---|---|---|---|---|
| 1 | High | `services/sirinx-api-worker/src/index.ts` `sanitizeText` | Only stripped `<`/`>` chars, so `<script>alert(1)</script>` content leaked into stored lead text (stored XSS vector) | Strip script/style blocks, then full tag spans, then brackets, collapse whitespace |
| 2 | Medium | `apps/sirinx-app/src/lib/sirinx-pipeline.ts` `sanitizeText` | Same sanitizer weakness duplicated in app pipeline lib | Same fix applied |
| 3 | Low | `services/sirinx-api-worker/src/index.test.ts` | Original test used `<SIRINX Factory>` input, which the hardened sanitizer now (correctly) treats as a tag; test would fail | Updated test input to realistic `<b>SIRINX Factory</b>` markup |
| 4 | Medium | `apps/sirinx-app/src/services/leads.ts` `getLeads` mock branch | Mock fallback ignored `limit`/`offset` while the Supabase path honored them — pagination behaved differently in dev (mock) vs prod (DB) | Mock branch now applies `slice(offset, offset + (limit ?? 50))`, mirroring the DB path; regression test added for limit, offset, and offset-without-limit |
| 5 | High | `apps/sirinx-app/src/app/api/ai-customize/route.ts` | `await req.json()` had no try/catch — malformed JSON produced an unhandled SyntaxError (500) instead of 400 | Wrapped parse with try/catch → 400 Invalid JSON body; added non-object guard |
| 6 | High | `apps/sirinx-app/src/app/api/ai-customize/route.ts` | Missing/empty prompt crashed `localFallback` (`undefined.toLowerCase()` TypeError → 500) when the local model was unreachable | Validate prompt is a non-empty string → 400, before any fetch |
| 7 | Low | `apps/sirinx-app/src/app/api/openclaw/run/route.ts` | Executable check ran before the allowlist check, so unknown commands returned 503 (missing executable) instead of 400; diverged from the Worker's semantics | Reordered: validate allowlist first → unknown command always 400; executable unset → 503 only for valid commands |

## 5. Test Counts (baseline → final)

| Surface | Baseline | Final |
|---|---|---|
| Worker (`npm test`) | 9 | 37 |
| App libs (`npm run test:api-runtime`) | 4 | 10 |
| App services + libs + API routes (`npm run test:services`) | 0 | 48 |
| **Total** | **13** | **95** |

All 95 pass. Zero failures, zero skipped.

## 5b. Fleet Engineering Note (honest)

Two fleet workers were spawned (`swarm spawn`, `openai-api:gpt-5.6-sol`) for the Supabase service layer and Next.js routes. Their journal files show only the spawn message — no assistant turns, no tool calls, both sharing a stale PID. The swarm spawn produced no live workers in this environment. Rather than claim fleet coverage that did not happen, the coordinator executed the full service-layer and app-route coverage itself (26 + 10 + 12 tests above). The fleet pattern is still encoded in the skill for environments where spawns actually run; verify worker liveness via journal/session files before relying on them.

## 6. Notable Non-Bugs and Type-Contract Fixes (verified)

- `export const dynamic = "force-static"` on POST routes is contradictory BUT required by `output: export` in next.config; removing it breaks the static-export build. Kept as-is. Routes still show `ƒ` dynamic in build output because POST handlers are inherently dynamic.
- `models/route.ts` probes `127.0.0.1` endpoints; fine for dev, returns offline in production static export.
- Supabase service layer pagination: `leads.ts` range math (`offset + limit - 1`) is correct; mock arrays mirror typed records.
- **Fixed type-contract mismatch:** all seven `*Insert` types in `database.types.ts` previously required every column while the services default most at runtime. They now make defaulted columns optional (only `name` / `province`+`system_size_kw` / `metric_name`+`metric_value` / `agent_name` required, matching each service's `create*` defaults). Tests no longer need casts. Update types are unchanged (`Partial<Insert>`).
- **Confirmed missing schema:** `database.types.ts` says "Auto-mapped from database/schema.sql", but no schema.sql exists anywhere in the repo (searched; only generic Supabase reference docs found). The type file is currently the only schema contract. Recommend committing the real DDL.

## 7. Recommendations

1. **Bind production secrets/bindings** before enabling dynamic routes: `SIRINX_AI_SERVER_TOKEN`, `SIRINX_ALLOWED_ORIGIN` (currently `*` in wrangler vars — tighten to exact origin), Hyperdrive `SIRINX_DB`, `OPENCLAW_SERVICE` binding, `ZHIPU_API_KEY`/`OPENROUTER_API_KEY`.
2. **Commit the DB schema**: `database.types.ts` references a `database/schema.sql` that does not exist. Commit the real DDL so DB functions (tables, RLS, defaults) are testable and types stay in sync.
3. **CI is now wired**: `.github/workflows/qa-engineering.yml` runs worker tests + typecheck + wrangler dry-run, app lib tests, app service/route tests (mock mode), app typecheck, build, and static smoke on every push/PR. All commands verified green locally; first CI run should confirm on GitHub.
4. **Route tests into fleet**: for the next pass, dispatch the supabase-services and nextjs-routes workers earlier so their findings merge into this report; verify liveness before relying on them.
5. **App routes are dev-only**: keep tests focused on libs + direct handler calls; the worker is the production API surface.

## 8. Process Skill Captured

The exact repeatable process used here is now a skill: `skills/qa-engineering-fleet/SKILL.md` (in this repo). It encodes: discovery, baseline, graph + coverage matrix, missing-test generation per surface (including direct NextRequest handler testing and tsx path-alias testing), bug-fix + regression loop, fleet engineering with worker-liveness verification, verification, and reporting. Reusable for any future QA pass on any skill/process.
