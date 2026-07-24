---
tags:
  - sirinx/authority/supporting
  - sirinx/brain
  - sirinx/brain/oz_corp_obsidian
  - sirinx/domain/agent-ops
  - sirinx/domain/content-factory
  - sirinx/domain/hermes
  - sirinx/domain/obsidian
  - sirinx/domain/product-design
  - sirinx/domain/security-governance
  - sirinx/role/doctrine_archive
---

# GitHub Monorepo Pack

Remote:

```txt
origin https://github.com/ton36475-lgtm/oz-corp-omega-dual-node.git
```

## Pack Contents

- `apps/sirinx-app`: Next.js web app
- `apps/clawhub-apple`: SwiftUI Apple app scaffold
- `services/hermes-agent`: local/A2A agent runtime
- `services/openclaw-worker`: orchestrator worker runtime
- `infrastructure/local-mcp-network`: Docker MCP stack
- `security`: secret scanning and hardening
- `knowledge/obsidian`: this vault

## Commit Flow

```sh
cd ~/ai-dev-macmini/monorepo-control
./oz status
./oz check
./oz commit "pack: add clawhub a2a mcp knowledge foundation"
./oz push
```

Review status before commit because the worktree includes older user changes.

