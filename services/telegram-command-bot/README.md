# Telegram Command Bot

Local command bridge for the old Telegram bot and SIRINX Command Center.

## Rooms

- PC node: `Ghostclaw HQ`
- Mac node: `@MultiAgentAiCompany_bot`

## Environment

```sh
export TELEGRAM_BOT_TOKEN="..."
export TELEGRAM_BOT_USERNAME="@MultiAgentAiCompany_bot"
export TELEGRAM_ALLOWED_CHAT_IDS="123456789"
export COMMAND_CENTER_URL="http://127.0.0.1:3002"
export NODE_PROFILE="mac"
export ROOM_NAME="@MultiAgentAiCompany_bot"
```

Do not commit real tokens or chat IDs.

## Run

```sh
node services/telegram-command-bot/index.mjs --dry-run
node services/telegram-command-bot/index.mjs
```

## Commands

```text
/status
/rooms
/pipeline
/utility
/commands
```
