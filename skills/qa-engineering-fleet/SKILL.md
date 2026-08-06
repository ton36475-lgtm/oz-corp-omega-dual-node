# QA Engineering Fleet Skill (Database + API + Full Function with Graph Coverage)

## Skill Name: `qa-engineering-fleet`

## Description
Repeatable QA engineering process for testing and debugging ALL database functions and API routes in a monorepo, with full function testing, route-to-handler graph coverage, and Fleet engineering (parallel agents). Captures the exact process proven on OZ-CORP-MONOREPO (2026-08-06): worker API 37/37 tests green, app lib 10/10 tests green, typecheck clean, dry-run deploy valid, XSS sanitizer bug found and fixed in both worker and app pipeline libs.

## Goal
Produce a fully tested, debugged system: every API route exercised (happy path, invalid input, edge cases, method guards, CORS, auth, size limits), every database function audited (query correctness, error handling, mock-fallback parity), with a route->handler->function graph, coverage matrix, and a QA report. The process is repeatable for ANY skill/process in the fleet.

## Prerequisites
- Node 20+ with the project's test runner (node:test + tsx, or vitest/jest).
- For Cloudflare workers: `wrangler` with `--dry-run` capability.
- For Supabase: `supabase` CLI and typed client (`database.types.ts`).
- Fleet model routes available (check `swarm list_models`).

## Process (repeatable, in order)

### Phase 0: Discover the system (5 min)
1. List top-level dirs to find the monorepo root and apps/services/packages.
2. `ls` each `apps/*/src`, `services/*/src` to find API routes (`route.ts` or worker `index.ts`) and service layers.
3. Build the graph inventory in a todo list:
   - Route path -> handler function -> helper functions -> services/tables used.
4. Read `package.json` for test/typecheck/build scripts.
5. Check for `wrangler.jsonc`, `supabase/` dir, `database.types.ts`, `.env` presence (never read secrets).

### Phase 1: Baseline (10 min)
1. Run existing tests: `npm test` / `npm run test:api-runtime` / `npm run smoke:static`.
2. Run typecheck: `npx tsc --noEmit` in each app/service.
3. Run build: `npm run build` (Next.js static export) and `npx wrangler deploy --dry-run`.
4. Record baseline: tests passed, typecheck clean, build clean, dry-run valid.

### Phase 2: Route graph + coverage matrix (15 min)
1. For each route, enumerate test cases:
   - Happy path (valid input, expected status + body shape)
   - Invalid input (missing fields, wrong types, empty strings)
   - Edge cases (oversized body, max counts, boundary values, sanitization of HTML/script)
   - Method guards (405 with Allow header)
   - CORS (OPTIONS preflight, origin reflection, fallback)
   - Auth (missing/wrong/valid token, alternate header)
   - External dependency failures (AI binding throws, gateway down, provider 4xx)
2. Mark in the matrix which routes are covered by existing tests vs. need new tests.

### Phase 3: Write missing tests (per surface)
- **Cloudflare Worker** (`services/*/src/index.ts`): add `src/index.edge.test.ts` following the existing `index.test.ts` style (node:test + `handleRequest` import). Cover every route's GET/POST/OPTIONS/DELETE, 404, auth, size limits, sanitization, mocked service bindings and mocked fetch.
- **Next.js app routes** (`apps/*/src/app/api/**/route.ts`): these are dev-only stubs; the worker is the production surface. Test them by importing the exported GET/POST handlers and calling with `new NextRequest('http://localhost:3000/path', {method, headers, body})` under tsx. Cast the init through `unknown` to Next's own RequestInit type (`ConstructorParameters<typeof NextRequest>[1]`) to satisfy its stricter `signal` typing. Run with `--test-force-exit`: ai-customize and models create abort timers that otherwise hold the test process open.
- **Supabase service layer** (`apps/*/src/services/*.ts`): audit each function for query construction, error handling, mock-fallback parity, pagination math, null safety, type alignment with `database.types.ts`.
  - Technique: the app's `@/*` path aliases do NOT resolve under plain `node --test`. Add `tsx` as a devDependency and run service tests with `env -u NEXT_PUBLIC_SUPABASE_URL -u NEXT_PUBLIC_SUPABASE_ANON_KEY tsx --test "src/services/**/*.test.ts"` so aliases resolve and mock mode is guaranteed. Probe alias resolution with a tiny script before writing many tests.
  - The `*Insert` types may require every column while the services default most at runtime. Align the types with the runtime contract: only columns the `create*` service does NOT default should be required (e.g. leads requires only `name`). This removes the need for unsafe casts in tests. Keep `Update = Partial<Insert>`.

### Phase 4: Fix bugs with regression tests
For each bug found:
1. Read the source, understand intent.
2. Apply the minimal fix.
3. Update/extend the test that exposes the bug (regression).
4. Re-run the suite for that surface until green.
5. If a fix changes documented behavior, update the original test to the realistic input, and note it in the report.

Common bug classes found on this fleet:
- Sanitizer strips only `<`/`>` instead of full tag spans -> script content leaks into stored text. Fix: strip `<script>...</script>` and `<style>...</style>` blocks, then remaining tags, then brackets, then collapse whitespace.
- Mock fallback ignores pagination options (limit/offset) while the DB path honors them -> dev (mock) and prod (DB) paginate differently. Fix: apply `slice(offset, offset + (limit ?? defaultPage))` in the mock branch to mirror the Supabase path, and add regression tests for limit, offset, and offset-without-limit.
- `force-static` on POST routes that read `req.json()`: with `output: export` this annotation is REQUIRED for the build; do NOT remove it. It is contradictory but build-mandated. Leave it and note it.
- Missing `req.json()` try/catch -> unhandled 500 on malformed JSON. Fix: wrap parse, return 400. Audit EVERY route handler for this (ai-customize had it; the other app routes did not).
- Unvalidated handler input crashes fallback logic -> e.g. missing prompt reached `localFallback(undefined)` and threw TypeError. Fix: validate required string fields before any fetch or fallback, return 400.
- Validation ordering: checks that depend on external state (executable present, binding configured) should run AFTER input allowlist checks so invalid input always returns 4xx regardless of environment.
- Mock data shape drifting from typed records -> unsafe casts. Fix: keep mocks aligned with `database.types.ts`.
- Gateway URL join double-slashes if base URL already ends in `/api/`. Fix: strip trailing slashes from base before appending path.

### Phase 5: Fleet engineering (parallel workers)
When multiple surfaces exist, dispatch parallel workers:
1. `swarm list_models` to find available routes (e.g. `openai-api:gpt-5.6-sol`).
2. Spawn one worker per surface with `swarm spawn`:
   - label: e.g. "supabase services QA", "nextjs api routes QA"
   - model: a route from list_models (check credentials first)
   - working_dir: repo root
   - prompt: precise scope, rules (never deploy/push/touch production), and required report format (audited, tested, bugs found with file:line + severity, tests added, files changed).
3. VERIFY LIVENESS before relying on workers: their session journal files must show assistant turns and tool activity after spawn (check `~/.jcode/sessions/<session-id>.journal.jsonl`). Observed failure mode: spawn returns a session id but the worker never runs (stale PID, no assistant turns). If workers are dead, execute the coverage yourself rather than claiming fleet coverage.
4. Track via `session_search` with the working dir and distinctive keywords, or have them report back to you.
5. Merge their findings into the final report.

### Phase 6: Verification (5 min)
1. Re-run all suites: worker tests, app lib tests, typecheck both, build, wrangler dry-run, smoke:static.
2. Confirm all green.
3. `git status --short` to enumerate exactly what changed.

### Phase 7: Report (10 min)
Write `QA_DISPATCH_REPORT.md` at repo root with:
- Scope: what was tested (routes, services, libs)
- Graph: route -> handler -> functions
- Coverage matrix: route x cases, pass/fail, notes
- Bugs found/fixed: file:line, description, severity, fix
- Test counts: baseline vs final, per surface
- Verification evidence: typecheck, build, dry-run outputs
- Recommendations: production bindings to add (secrets, Hyperdrive, service bindings), schema.sql to commit, CI to add.

## Rules (hard)
1. NEVER deploy, push, or touch production data/secrets. Only `--dry-run`.
2. Only edit files inside the repo root.
3. Do not git commit unless the user asked.
4. Do not remove build-mandated annotations (`force-static` under `output: export`).
5. Test the code as it behaves, not as docs claim; document deltas.
6. Every bug fix ships with a regression test that fails before the fix.

## When finished
Report `DONE` with: surfaces tested, bugs found/fixed, test counts (baseline -> final), verification evidence, and where the report lives.
