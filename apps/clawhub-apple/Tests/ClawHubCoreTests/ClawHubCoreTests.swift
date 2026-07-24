import ClawHubCore
import XCTest

final class ClawHubCoreTests: XCTestCase {
    func testLocalMacMiniProfileIncludesLocalLLM() {
        let state = ClawHubState.localMacMini()

        XCTAssertEqual(state.device.family, .mac)
        XCTAssertTrue(state.device.capabilities.contains(.localLLM))
        XCTAssertTrue(state.endpoints.contains { $0.name == "Ollama" })
    }
}

