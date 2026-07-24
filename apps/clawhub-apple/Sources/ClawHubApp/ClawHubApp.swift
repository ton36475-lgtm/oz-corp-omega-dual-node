import ClawHubCore
import SwiftUI

@main
struct ClawHubApp: App {
    var body: some Scene {
        WindowGroup {
            ClawHubHomeView(state: .localMacMini())
        }
    }
}

struct ClawHubHomeView: View {
    let state: ClawHubState

    var body: some View {
        NavigationStack {
            List {
                Section("Device") {
                    Text(state.device.family.rawValue)
                    ForEach(Array(state.device.capabilities).sorted(by: { $0.rawValue < $1.rawValue }), id: \.rawValue) { capability in
                        Text(capability.rawValue)
                    }
                }

                Section("Endpoints") {
                    ForEach(state.endpoints, id: \.name) { endpoint in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(endpoint.name)
                                .font(.headline)
                            Text(endpoint.url.absoluteString)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("ClawHub")
        }
    }
}

