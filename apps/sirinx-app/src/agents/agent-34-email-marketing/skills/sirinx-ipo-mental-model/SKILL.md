---
name: sirinx-ipo-mental-model
description: >
  SIRINX IPO Mental Model — Input→Process→Output folder structure และ thinking framework
  จัดระเบียบ workflows, code, และ docs ด้วย IPO pattern สำหรับทุก agent และ feature
  Triggers on: IPO, input process output, folder structure, organize, จัดระเบียบ, framework
---

# SIRINX IPO Mental Model — v1.0

**Mission:** ใช้ Input→Process→Output framework ในการออกแบบ folder structure, agent logic, และ workflows

---

## IPO Framework

```
INPUT          →    PROCESS         →    OUTPUT
(Raw data)         (Transform)          (Deliverable)
```

## Folder Structure Pattern

```
feature/
├── input/
│   ├── schemas/      # Input validation schemas
│   ├── sources/      # Data source connectors
│   └── parsers/      # Raw data parsers
├── process/
│   ├── agents/       # Processing logic
│   ├── transforms/   # Data transformations
│   └── rules/        # Business logic
└── output/
    ├── formatters/   # Output formatting
    ├── destinations/ # Where to send output
    └── schemas/      # Output validation
```

## Applied to 47 Ronin Layers

| Layer | INPUT | PROCESS | OUTPUT |
|-------|-------|---------|--------|
| L1 | Raw sensor data, social feeds | Parse + normalize | Structured events |
| L2 | L1 events | Analyze + score | Insights + metrics |
| L3 | L2 insights | Decision logic | Action plans |
| L4 | L3 plans | Orchestrate | Coordinated execution |
| L5 | L4 results | Research + learn | Knowledge updates |

## Applied to Agent Execute()

```typescript
async execute(input: AgentInput): Promise<AgentOutput> {
  // INPUT phase
  const validated = await this.validateInput(input)
  const context = await this.loadContext(validated)

  // PROCESS phase
  const result = await this.process(context)

  // OUTPUT phase
  await this.publishEvent('result', result)
  return this.formatOutput(result)
}
```

## Applied to n8n Workflows

```
[Trigger / Input Node]
       ↓
[Transform / Process Nodes]
       ↓
[Action / Output Nodes]
```

## Status
✅ **Active** — Use this framework when designing new features, agents, or workflows
