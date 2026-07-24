#!/usr/bin/env bash
set -euo pipefail

echo "== Docker contexts =="
docker context ls

echo
echo "== Docker version =="
docker version

echo
echo "== Running containers =="
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'

echo
echo "== Local MCP compose =="
docker compose -f "$(dirname "$0")/../local-mcp-network/docker-compose.yml" ps

