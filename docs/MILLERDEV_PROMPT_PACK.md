# MillerDev Prompt Pack

Canonical prompt-pack registry for the OZ-CORP / SIRINX agent workspace.

## Standard

MillerDev prompt-pack work means every prompt asset must be:

- **Brand locked:** SIRINX colors, voice, ICP, contact block, and Thai-first business context.
- **Agent ready:** usable by any of the 47 agent directories plus `chatbot-kai` without extra setup.
- **Output typed:** every request declares modes such as `[VISUAL]`, `[PROMPT-PACK]`, `[COPY]`, `[CAMPAIGN]`, or `[DECK]`.
- **Production scoped:** prompts produce website, campaign, sales, deck, SEO/AEO, and social assets that can ship into the SIRINX workflow.
- **Verifiable:** prompt packs include aspect ratios, target platform, use case, and quality checklist.

## Brain Command

For AI developer coding behavior, use:

```text
docs/MILLERDEV_BRAIN_COMMAND.md
```

For MCP tool-call planning behavior, use:

```text
docs/MILLERDEV_MCP_4_PILLAR_PLAN.md
```

One-line trigger:

```text
Use MillerDev Brain Command: read context first, infer the real goal, implement focused production-grade code, verify it, and report clearly.
```

## Canonical Skill

Use the repo-level skill:

```text
skills/sirinx-master-gem/SKILL.md
```

The same prompt pack is also installed under each agent:

```text
apps/sirinx-app/src/agents/<agent-id>/skills/sirinx-master-gem/SKILL.md
```

Current coverage: 48 agent directories.

## Primary Command

For full image prompt-pack generation, use command `#29` from SIRINX Master GEM:

```text
[PROMPT-PACK][VISUAL][FULL]
Master image prompt pack — all 10 categories, 22 prompts
```

For website image batches, use:

```text
[VISUAL][PROMPT-PACK][BRAND-LOCKED]
```

## Required Prompt Fields

Every generated prompt-pack item should include:

- `prompt_id`
- `category`
- `target_page` or `target_asset`
- `platform`
- `aspect_ratio`
- `prompt`
- `negative_guidance`
- `brand_notes`

## JSON Shape

```json
{
  "prompt_id": "HER-01-V1",
  "category": "hero",
  "target_page": "/",
  "platform": "midjourney",
  "aspect_ratio": "16:9",
  "prompt": "Aerial drone view of a large Thai industrial factory...",
  "negative_guidance": "No text overlays, no cartoon style, no generic stock-photo look.",
  "brand_notes": "Deep navy #0A2342, solar gold #F5A623, emerald green #10B981."
}
```

## Agent Routing

- Creative and visual work: `agent-30-promotion-engine`, `agent-33-content-request`, `agent-34-email-marketing`, `agent-39-growth-acq`, `chatbot-kai`.
- Website and dashboard assets: `agent-36-customer-portal`, `agent-37-core-dashboard`, `agent-38-contractor-portal`.
- SEO/AEO and research-backed copy: `agent-25-competitor-intel`, `agent-28-job-posting`, `agent-44-ai-trend-scanner`, `agent-46-benchmark-research`.
- Coordination and QA: `agent-35-orchestrator`, `agent-40-decision-router`, `agent-41-state-manager`, `agent-43-security`.

## Quality Gate

Before delivery:

- Confirm the output mode is declared.
- Confirm SIRINX brand colors and Thai industrial context are present.
- Confirm aspect ratio and platform syntax are included for image prompts.
- Confirm no prompt asks for visible text unless the asset explicitly requires text.
- Confirm the contact block is included for marketing copy and collateral.
