# OZ Monorepo Pack

This repository now has one pack structure for:

- Web app
- Apple app scaffold
- Local/remote LLM routing
- A2A agent-to-agent workflow
- Local MCP Docker network
- OrbStack local runtime
- Kanban board
- Obsidian knowledge vault
- Security guardrails

## Start Local MCP

```sh
cd infrastructure/local-mcp-network
docker compose up -d
```

## Run Checks

```sh
pnpm -C services/hermes-agent check
pnpm -C apps/sirinx-app typecheck
pnpm -C apps/sirinx-app build
./security/secret-scan.sh
```

## Open Knowledge Vault

Open `knowledge/obsidian` in Obsidian.
