# Security Guardrails

This repo must not store real API keys, passwords, private keys, access tokens, or tunnel credentials.

Use one of these instead:

- macOS Keychain
- shell environment variables
- Cloudflare/Azure/GitHub managed secrets
- local `.env` files ignored by git

## Local Secret Template

Copy `secrets.local.example.env` to a local ignored file if needed:

```sh
cp security/secrets.local.example.env security/secrets.local.env
chmod 600 security/secrets.local.env
```

Never commit `security/secrets.local.env`.

Prefer macOS Keychain for valuable keys:

```sh
./security/put-secret.sh GROK_API_KEY
./security/secret-status.sh
```

Run commands with local secrets loaded:

```sh
./security/run-with-secrets.sh pnpm -C services/hermes-agent dev
```

## Scan

```sh
./security/secret-scan.sh
```

The scanner is intentionally conservative and uses local tools only.
