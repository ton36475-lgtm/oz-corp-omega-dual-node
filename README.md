# thCludeCode
thCludeCode is a manager project for the thClaw Orchestrator, with local-first AI orchestration, n8n pipelines, and optional Cloudflare Tunnel publishing.

## What this repo provides
- `services/openclaw-worker/`: thClaw orchestrator runtime (supports local DeepSeek endpoint config)
- `services/docker-compose.yml`: n8n + MongoDB stack, with optional Cloudflare Tunnel profile
- `scripts/install_thcludecode_manager.sh`: auto-install and auto-config bootstrap
- `scripts/run_thcludecode_stack.sh`: start orchestrator + pipeline stack in background
- `scripts/stop_thcludecode_stack.sh`: stop background stack
- `infra/systemd/` and `infra/launchd/`: background service templates
- `skills/sirinx-master-gem/`: MillerDev prompt-pack canonical skill for SIRINX brand creative, SEO/AEO, campaigns, and image prompts
- `docs/MILLERDEV_PROMPT_PACK.md`: prompt-pack operating standard and agent routing
- `docs/MILLERDEV_BRAIN_COMMAND.md`: compact AI developer coding prompt for MillerDev-style reasoning and execution
- `docs/MILLERDEV_MCP_4_PILLAR_PLAN.md`: MCP tool-call operating plan for context, routing, execution, and verification
- `docs/MILLERDEV_REPEATABLE_PROCESS.md`: end-to-end repeatable process combining brain command, prompt pack, MCP plan, token pipeline, character DNA, and website restore
- `docs/HERMES_THCLAW_UTILITY_TOOL.md`: real Hermes/thCLAW utility tool bridge for language scan, check planning, and token-aware coding support
- `services/telegram-command-bot/`: local Telegram bridge for `@MultiAgentAiCompany_bot`, Ghostclaw HQ room routing, and command-center tools

## Quick start
1. Bootstrap dependencies and local config:
   - `bash scripts/install_thcludecode_manager.sh`
2. Start the full local manager stack:
   - `bash scripts/run_thcludecode_stack.sh`
3. Stop it when needed:
   - `bash scripts/stop_thcludecode_stack.sh`

## Optional Cloudflare Tunnel (free plan)
Run compose with the cloudflare profile after you set `CLOUDFLARE_TUNNEL_TOKEN` in `services/.env`:
- `docker compose -f services/docker-compose.yml --env-file services/.env --profile cloudflare up -d`

## Safety
Do not commit `.env`, API keys, tokens, credentials, build artifacts, logs, or virtual environments.
