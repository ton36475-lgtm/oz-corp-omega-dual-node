# OrbStack Local Infrastructure

This Mac uses OrbStack as the Docker-compatible local runtime.

Current Docker context:

```txt
orbstack
```

OrbStack provides:

- Docker Engine
- Docker Compose
- Linux containers on Apple Silicon
- Local Kubernetes/system containers
- Fast local development networking

## Current Local MCP Services

Started from:

```txt
infrastructure/local-mcp-network
```

Services:

- `mcp-gateway`: `127.0.0.1:8787`
- `mcp-n8n`: `127.0.0.1:5678`
- `mcp-redis`: `127.0.0.1:6379`

## Commands

```sh
docker context use orbstack
cd infrastructure/local-mcp-network
docker compose ps
docker compose up -d
docker compose logs -f
docker compose down
```

## Security

Keep app ports bound to `127.0.0.1` unless a Cloudflare tunnel/auth layer is configured.

