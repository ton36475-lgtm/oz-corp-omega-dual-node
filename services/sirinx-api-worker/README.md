# SIRINX API Worker

Production runtime for OZ/SIRINX dynamic POST APIs.

The Next app in `apps/sirinx-app` remains a static export. Dynamic POST routes that cannot run on Cloudflare Pages static hosting live here:

- `POST /api/command-center/tool`
- `POST /api/pipeline/plan`
- `GET /api/runtime/readiness`
- `GET /api/ai/server`
- `POST /api/ai/compute`
- `POST /api/openclaw/run`
- `POST /api/ai-customize`
- `POST /api/vision/analyze`

Static GET discovery remains available from the exported app at `/api/command-center/status` and points operators to this Worker runtime.

## Commands

```bash
pnpm --filter sirinx-api-worker test
pnpm --filter sirinx-api-worker check
pnpm --filter sirinx-api-worker types:cf
pnpm --filter sirinx-api-worker deploy:dry-run
pnpm --filter sirinx-api-worker dev
```

## Static App Wiring

The static Next app calls this Worker for dynamic POST APIs through:

```bash
NEXT_PUBLIC_SIRINX_API_BASE_URL=https://api.sirinx.ai
```

For local development, leave the value empty and run the Next dev server and Worker on the same origin/proxy path, or set it to the local Worker origin such as `http://127.0.0.1:8787`.

Set `SIRINX_ALLOWED_ORIGIN` in `wrangler.jsonc` or a named environment before production deploy. Prefer exact origins such as `https://sirinx.ai` instead of `*` for deployed production.

## Cloudflare Workers AI Compute

`wrangler.jsonc` binds Cloudflare Workers AI as `env.AI`:

```jsonc
"ai": {
  "binding": "AI"
}
```

The default text-generation model is configured with:

```bash
SIRINX_WORKERS_AI_MODEL=@cf/meta/llama-3.1-8b-instruct
```

Use:

- `GET /api/ai/server` to inspect the AI server binding/config state.
- `POST /api/ai/compute` with `{ "prompt": "..." }` to run Workers AI inference.

Protect live compute with a Worker secret. Requests must send `Authorization: Bearer <token>` or `x-sirinx-ai-token`.

```bash
pnpm --filter sirinx-api-worker exec wrangler secret put SIRINX_AI_SERVER_TOKEN
```

Wrangler local development for Workers AI can use Cloudflare account-backed compute. Use unit tests and `deploy:dry-run` when you only need packaging validation.

## Production Secrets

Set secrets with Wrangler. Do not commit secret values.

```bash
pnpm --filter sirinx-api-worker exec wrangler secret put ZHIPU_API_KEY
pnpm --filter sirinx-api-worker exec wrangler secret put OPENROUTER_API_KEY
```

`ZHIPU_API_KEY` is preferred for `/api/vision/analyze`. `OPENROUTER_API_KEY` is the fallback for the GLM vision model.

## OpenClaw Execution

`/api/openclaw/run` keeps the preset allowlist from the Next route but does not spawn local processes inside the Worker. Production execution must be attached through an internal Worker service binding named `OPENCLAW_SERVICE`.

Until that binding exists, allowed commands return a 503 readiness response instead of pretending execution happened.

## Production Database Access

If a dynamic route needs PostgreSQL or MySQL, bind the database through Cloudflare Hyperdrive and keep the direct database URL out of application code. Add the Hyperdrive binding to `wrangler.jsonc`, regenerate types with `pnpm --filter sirinx-api-worker types:cf`, and access the binding from `env`.
