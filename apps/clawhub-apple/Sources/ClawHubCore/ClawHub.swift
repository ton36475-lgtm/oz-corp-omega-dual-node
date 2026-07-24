import Foundation

public enum ClawHubDeviceFamily: String, Codable, CaseIterable, Sendable {
    case mac
    case iPhone
    case iPad
    case watch
    case futureAppleSilicon
}

public enum ClawHubCapability: String, Codable, CaseIterable, Sendable {
    case localLLM
    case terminalControl
    case repoStatus
    case agentSwarm
    case approvalQueue
    case cloudTunnel
}

public struct ClawHubEndpoint: Codable, Equatable, Sendable {
    public let name: String
    public let url: URL
    public let capabilities: Set<ClawHubCapability>

    public init(name: String, url: URL, capabilities: Set<ClawHubCapability>) {
        self.name = name
        self.url = url
        self.capabilities = capabilities
    }
}

public struct ClawHubDeviceProfile: Codable, Equatable, Sendable {
    public let family: ClawHubDeviceFamily
    public let capabilities: Set<ClawHubCapability>

    public init(family: ClawHubDeviceFamily, capabilities: Set<ClawHubCapability>) {
        self.family = family
        self.capabilities = capabilities
    }

    public static let macMiniDeveloper = ClawHubDeviceProfile(
        family: .mac,
        capabilities: [.localLLM, .terminalControl, .repoStatus, .agentSwarm, .approvalQueue, .cloudTunnel]
    )
}

public struct ClawHubState: Codable, Equatable, Sendable {
    public let device: ClawHubDeviceProfile
    public let endpoints: [ClawHubEndpoint]

    public init(device: ClawHubDeviceProfile, endpoints: [ClawHubEndpoint]) {
        self.device = device
        self.endpoints = endpoints
    }

    public static func localMacMini() -> ClawHubState {
        ClawHubState(
            device: .macMiniDeveloper,
            endpoints: [
                ClawHubEndpoint(
                    name: "Ollama",
                    url: URL(string: "http://localhost:11434")!,
                    capabilities: [.localLLM]
                ),
                ClawHubEndpoint(
                    name: "Hermes",
                    url: URL(string: "http://localhost:3001")!,
                    capabilities: [.agentSwarm, .repoStatus]
                ),
                ClawHubEndpoint(
                    name: "OpenClaw",
                    url: URL(string: "http://localhost:3002")!,
                    capabilities: [.agentSwarm, .approvalQueue]
                )
            ]
        )
    }
}

