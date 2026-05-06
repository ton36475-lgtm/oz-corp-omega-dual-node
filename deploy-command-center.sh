#!/usr/bin/env bash
# Deploy sirinx-app static export to Cloudflare Pages (oz-hermes-dashboard).
# Requires: pnpm, wrangler auth (oauth or env), no secrets in this repo.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="${OZ_PAGES_PROJECT:-oz-hermes-dashboard}"
APP="$ROOT/apps/sirinx-app"

cd "$APP"
pnpm install
pnpm build
npx wrangler pages deploy ./out --project-name "$PROJECT_NAME" "$@"

echo "Production URL: https://${PROJECT_NAME}.pages.dev/command-center"
