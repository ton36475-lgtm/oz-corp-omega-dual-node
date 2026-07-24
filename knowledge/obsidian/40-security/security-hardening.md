# Security Hardening

Use defensive workflows only.

## Rules

- Do not commit API keys.
- Do not expose local MCP services to public network.
- Bind Docker ports to `127.0.0.1`.
- Use Cloudflare tunnel with auth for external access.
- Run `security/secret-scan.sh` before commit.
- Keep heavy local models removed unless needed.

## Local Secret Storage

Use `.env.local`, macOS Keychain, GitHub secrets, Cloudflare secrets, or Azure Key Vault.

