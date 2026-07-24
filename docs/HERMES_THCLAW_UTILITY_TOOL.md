# Hermes/thCLAW Utility Tool

This is the real shared utility layer for Hermes and thCLAW.

## Purpose

- Let Hermes and thCLAW see the same utility capability.
- Detect multi-language coding context without loading every file into an LLM.
- Produce safe verification plans for TypeScript, JavaScript, Python, Rust, Go, Shell, JSON, Markdown, and YAML.
- Support token management with context budgeting.

## Hermes

Files:

```text
services/hermes-agent/src/tools/utility-tool.ts
services/hermes-agent/src/tools/safe-command-tool.ts
services/hermes-agent/src/index.ts
```

Safe commands:

```text
utility_manifest
language_scan
check_plan
```

Run:

```sh
pnpm -C services/hermes-agent check
pnpm -C services/hermes-agent dev
```

## thCLAW

File:

```text
services/openclaw-worker/orchestrator.py
```

MCP client:

```text
utility_tool
```

Supported utility requests:

```json
{ "utility": "manifest" }
{ "utility": "language_scan" }
{ "utility": "check_plan" }
{ "utility": "context_budget" }
```

Run:

```sh
python3 -m py_compile services/openclaw-worker/orchestrator.py
python3 services/openclaw-worker/orchestrator.py --utility manifest
python3 services/openclaw-worker/orchestrator.py --utility language_scan
python3 services/openclaw-worker/orchestrator.py --utility check_plan
python3 services/openclaw-worker/orchestrator.py --mode batch --tasks 1
```

## Multi-Language Coding Support

Supported language detection:

| Language | Extensions |
|---|---|
| TypeScript | `.ts`, `.tsx` |
| JavaScript | `.js`, `.jsx`, `.mjs`, `.cjs` |
| Python | `.py` |
| Rust | `.rs` |
| Go | `.go` |
| Shell | `.sh`, `.bash`, `.zsh` |
| JSON | `.json` |
| Markdown | `.md`, `.mdx` |
| YAML | `.yml`, `.yaml` |

## Repeatable Rule

Before coding:

```text
1. Call utility_manifest.
2. Call language_scan.
3. Call check_plan.
4. Select the smallest verification command for the touched language.
5. Keep context bounded. Request exact files only.
```
