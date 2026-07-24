// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "ClawHubApple",
    platforms: [
        .macOS(.v14),
        .iOS(.v17),
        .watchOS(.v10)
    ],
    products: [
        .library(name: "ClawHubCore", targets: ["ClawHubCore"]),
        .executable(name: "ClawHubApp", targets: ["ClawHubApp"])
    ],
    targets: [
        .target(name: "ClawHubCore"),
        .executableTarget(
            name: "ClawHubApp",
            dependencies: ["ClawHubCore"]
        ),
        .testTarget(
            name: "ClawHubCoreTests",
            dependencies: ["ClawHubCore"]
        )
    ]
)

