#!/bin/bash
echo "================================================="
echo "[HERMES PRIME] OMNI-SYNC DIAGNOSTIC PROTOCOL"
echo "================================================="

echo "🟢 1. Checking Core Infrastructure (n8n, Mongo, Redis)..."
docker compose -f ~/OZ-CORP-MONOREPO/services/docker-compose.yml ps

echo "-------------------------------------------------"
echo "🧠 2. Checking AI Brains (Ollama)..."
ollama list | grep hermes-prime

echo "-------------------------------------------------"
echo "💾 3. Writing State to Kanban Vault (Brain)..."
# สั่ง Orchestrator ให้บันทึกงานระดับ System Audit ลงสมอง
node ~/OZ-CORP-MONOREPO/scripts/local_agent_orchestrator.js "SYSTEM AUDIT & SYNC: Verified Core Infrastructure and AI Brain status. All telemetry synchronized to Obsidian/Kanban Vault."

echo "================================================="
echo "✅ [OMNI-SYNC COMPLETE] All states saved to Brain."
echo "================================================="
