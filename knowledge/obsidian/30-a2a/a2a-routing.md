# A2A Routing

Hermes supports adaptive provider routing:

- Local fast model: Ollama `llama3.2:3b`
- Remote pro model: Grok/xAI via `GROK_API_KEY`

No API key is committed.

## Environment

```sh
HERMES_LLM_MODE=adaptive
HERMES_LLM_PROVIDER=ollama
GROK_API_KEY=
GROK_MODEL=grok-4
```

## Intent

A2A messages should be structured:

```json
{
  "protocol": "A2A",
  "fromAgent": "hermes",
  "toAgent": "clawhub",
  "intent": "status_check",
  "payload": "Check local MCP health"
}
```

