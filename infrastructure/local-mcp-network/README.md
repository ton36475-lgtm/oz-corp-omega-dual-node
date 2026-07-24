# Local MCP Network

Docker/OrbStack local network for MCP-style development on this Mac.

Services:

- `mcp-redis`: local queue/cache for agent messages
- `mcp-n8n`: local workflow runner
- `mcp-gateway`: placeholder local HTTP gateway

All exposed ports bind to `127.0.0.1` only.

## Start

Open OrbStack first, then:

```sh
cd infrastructure/local-mcp-network
docker compose up -d
docker compose ps
```

## Stop

```sh
docker compose down
```

## URLs

- n8n: `http://127.0.0.1:5678`
- MCP gateway placeholder: `http://127.0.0.1:8787`
- Redis: `127.0.0.1:6379`

## Security

- Do not bind these services to `0.0.0.0`.
- Do not commit `.env`.
- Put passwords in `.env`, copied from `.env.example`.

