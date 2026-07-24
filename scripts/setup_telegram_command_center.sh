#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_PROFILE="${NODE_PROFILE:-mac}"
ROOM_NAME="${ROOM_NAME:-}"

if [[ -z "$ROOM_NAME" ]]; then
  if [[ "$NODE_PROFILE" == "mac" ]]; then
    ROOM_NAME="@MultiAgentAiCompany_bot"
  else
    ROOM_NAME="Ghostclaw HQ"
  fi
fi

cat <<INFO
SIRINX Telegram Command Center
Root: $ROOT_DIR
Node profile: $NODE_PROFILE
Room: $ROOM_NAME

Dry-run:
  NODE_PROFILE="$NODE_PROFILE" ROOM_NAME="$ROOM_NAME" node "$ROOT_DIR/services/telegram-command-bot/index.mjs" --dry-run

Run with old bot token:
  export TELEGRAM_BOT_TOKEN="..."
  export TELEGRAM_ALLOWED_CHAT_IDS="..."
  export COMMAND_CENTER_URL="http://127.0.0.1:3002"
  NODE_PROFILE="$NODE_PROFILE" ROOM_NAME="$ROOM_NAME" node "$ROOT_DIR/services/telegram-command-bot/index.mjs"

Command Center API:
  curl -s http://127.0.0.1:3002/api/command-center/tool \\
    -H 'Content-Type: application/json' \\
    -d '{"telegramText":"/status"}'
INFO
