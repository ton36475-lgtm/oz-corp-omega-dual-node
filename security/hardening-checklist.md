# Server Hardening Checklist

- Keep API keys out of git.
- Put production secrets in managed secret stores.
- Use Cloudflare tunnel or VPN instead of exposing local ports directly.
- Bind local Docker services to `127.0.0.1`, not `0.0.0.0`.
- Require authentication on dashboards, n8n, admin panels, databases, and model gateways.
- Do not run downloaded scripts without reviewing them.
- Disable daemon loops by default; run orchestrators in bounded batch mode first.
- Keep Ollama models minimal on this Mac; use `llama3.2:3b` for fast local routing.
- Run `security/secret-scan.sh` before commits.
- Review `git status --short` before `git add -A`.
