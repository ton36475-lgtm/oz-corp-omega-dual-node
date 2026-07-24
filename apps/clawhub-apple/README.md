# ClawHub Apple

ClawHub is the Apple-platform command surface for OpenClaw/Hermes.

Initial target:

- macOS on this Mac mini M2

Future targets:

- iPhone
- iPad
- Apple Watch
- Any future Apple Silicon device class that can run SwiftUI apps

## Architecture

- `ClawHubCore`: shared models, routing, device capabilities, agent status
- `ClawHubApp`: SwiftUI shell for Apple platforms
- TestFlight path: build from Xcode, archive, upload to App Store Connect, distribute to internal testers first

## Local Build

Xcode license must be accepted first:

```sh
sudo xcodebuild -license accept
```

Then:

```sh
cd apps/clawhub-apple
swift test
swift run ClawHubApp
```

## Integration Targets

- Local Ollama: `http://localhost:11434`
- Hermes agent: `services/hermes-agent`
- OpenClaw worker: `services/openclaw-worker`
- Cloudflare tunnel: `~/ai-dev-macmini/cloudflare`

## TestFlight Learning Path

1. Build macOS prototype locally.
2. Add iOS/iPadOS layout adaptations.
3. Add watchOS companion surface for status, approvals, and alerts.
4. Create App Store Connect app record.
5. Archive from Xcode.
6. Upload build.
7. Release first to internal TestFlight testers.
8. Expand to external testers only after privacy, auth, and data policies are reviewed.

