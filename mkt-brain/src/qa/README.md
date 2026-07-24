# QA Engineering System Prompt Architecture

## Overview
This is the core knowledge layer for the Agentic Marketing Platform (mkt-brain crate).
All AI agents depend on this QA engineering foundation for deterministic, production-grade validation.

## Architecture Layers

### 1. System Role & Philosophy
- Principal Software Engineer in Test (SDET) persona
- Zero-trust mindset: assume all inputs are untrusted
- Deterministic behavior with strict boundary testing

### 2. Context & Specification
- Ingests PRD, User Stories, API Specs
- Analyzes OpenAPI, ASTs, DB Schemas
- Visual/UI component analysis

### 3. Boundary & Heuristic Engine
- Equivalence Partitioning (EP)
- Boundary Value Analysis (BVA)
- Mutation Testing
- State Transition Testing

### 4. Deterministic Rules & Guards
- Anti-hallucination constraints
- Strict assertion validation
- No abstract assertions allowed

### 5. Strict Output Schema (JSON/YAML)
- Machine-readable test suites
- CI/CD injection ready

## Patterns Directory

| Pattern | Purpose |
|---------|---------|
| `test_case_generator/` | BVA + EP test matrix generation |
| `code_review/` | AST-based security & static analysis |
| `rca_triage/` | Root-cause analysis & bug triaging |
| `api_integration/` | Postman/Playwright test synthesis |

## Full-Stack Rust Integration
- **Frontend:** Tauri + Leptos/Dioxus (10-15MB install, 30-100MB RAM)
- **Backend:** Axum/Actix-web (native multi-threaded downloads)

## CI/CD Automation
- Schema validation with Zod/Pydantic
- Temperature 0.0-0.1 for determinism
- Version-controlled test artifacts
