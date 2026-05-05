# SIRINX AI-WarRoom: Pillar 1 - Advanced Monorepo & AI-Driven Dashboard

This document outlines the enhancements for Pillar 1 of the OZ-CORP OMEGA project, focusing on upgrading the `sirinx-app` to an advanced monorepo structure with an AI-driven dashboard, leveraging Next.js 15+ and Tailwind CSS v4.

## 1. Current State Overview

The `sirinx-app` is the canonical Next.js 15 web application, currently running on port 3002. It serves as the primary interface for the SIRINX AI-WarRoom, integrating various agent functionalities and providing key dashboards. The current Tailwind CSS version is v3.4.1.

## 2. Objectives for Pillar 1 Enhancement

*   **Integrate `sirinx-app` into the `OZ-CORP` Monorepo:** Consolidate `sirinx-app` within the `/home/ubuntu/OZ-CORP` monorepo structure, alongside `solar-dashboard` and `oz-agent-gateway`, to facilitate shared packages and streamlined development.
*   **Upgrade Tailwind CSS to v4:** Transition the frontend styling from Tailwind CSS v3.4.1 to v4, ensuring compatibility and leveraging new features for a more modern and efficient design system.
*   **Develop AI-Driven Dashboard Components:** Enhance the existing dashboard with AI-powered features, including predictive analytics, real-time agent activity monitoring, and intelligent insights derived from the 47 Ronin agent system.
*   **Implement Multi-Agent Interaction UI:** Design and develop user interface components that allow for seamless interaction with and orchestration of multiple AI agents, reflecting the `sirinx-multi-agent-coordinator` skill.
*   **Optimize Performance and Scalability:** Ensure the dashboard is highly performant and scalable to handle real-time data streams and complex AI interactions.

## 3. Technical Implementation Plan

### 3.1 Monorepo Integration

1.  **Relocate `sirinx-app`:** Move the `sirinx-app` directory into `/home/ubuntu/OZ-CORP/apps/` to align with the monorepo structure.
2.  **Update `tsconfig.json` and `package.json`:** Adjust paths and dependencies to reflect the new monorepo setup. Introduce `pnpm workspaces` for efficient dependency management across `apps/` and `packages/`.
3.  **Shared UI Components:** Create a new package under `/home/ubuntu/OZ-CORP/packages/ui-components` for reusable React components, styled with Tailwind CSS, to be shared across `solar-dashboard` and `sirinx-app`.

### 3.2 Tailwind CSS v4 Upgrade

1.  **Review Tailwind v4 Migration Guide:** Identify breaking changes and new features. [Reference: Tailwind CSS v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
2.  **Update `tailwind.config.js`:** Modify the configuration file to be compatible with Tailwind v4.
3.  **Refactor CSS:** Adjust any custom CSS or component styles that are affected by the upgrade.

### 3.3 AI-Driven Dashboard Development

1.  **Real-time Data Integration:** Utilize WebSockets (as defined in `CLAUDE.md` and `sirinx-unified-os` skill) to stream real-time data from agents and system metrics to the dashboard.
2.  **Predictive Analytics Widgets:** Develop React components to display predictive insights (e.g., solar production forecasts from `agent-20-production-forecast`, lead scoring from `agent-24-lead-qualification`).
3.  **Agent Activity Feed:** Implement a dynamic feed showing the status and actions of individual 47 Ronin agents, leveraging the `sirinx-multi-agent-coordinator` and `sirinx-unified-os` skills.
4.  **Interactive Agent Control:** Integrate UI elements that allow users to trigger agent tasks or adjust agent parameters via the `sirinx-unified-os` and `sirinx-warroom-ceo-core` command interfaces.

### 3.4 Multi-Agent Interaction UI

1.  **Agent Command Center Page (`/agents`):** Enhance the existing `/agents` route to provide a comprehensive view and control panel for all 47 Ronin agents.
2.  **Task Orchestration Interface:** Develop a visual workflow builder or a command-line-like interface within the dashboard to orchestrate complex tasks involving multiple agents.
3.  **Feedback and Learning Loop UI:** Implement UI for agents to provide feedback and for the system to learn from user interactions, aligning with `agent-42-learning-optim`.

## 4. Next Steps

*   **Phase 2: Pillar 2 - Intelligent Nervous System** will focus on automating n8n workflows and enhancing MongoDB aggregation for deeper data insights.

This plan ensures a systematic approach to upgrading Pillar 1, integrating the `sirinx-app` into the `OZ-CORP` monorepo, and transforming the dashboard into a powerful AI-driven command center.
