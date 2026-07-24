import "dotenv/config";
import { AdaptiveA2ARouter } from "./llm/adaptive-router.js";
import { SafeCommandTool } from "./tools/safe-command-tool.js";
import { WranglerSkill } from "./tools/wrangler-tool.js";
import { HermesContinuity } from "./memory/continuity.js";

class HermesAgent {
  private llm = new AdaptiveA2ARouter();
  private commands = new SafeCommandTool();
  private wrangler = new WranglerSkill();
  private continuity = new HermesContinuity();

  async boot() {
    console.log("Hermes Agent: booting...");
    console.log("Hermes Agent: local LLM target:", process.env.OLLAMA_BASE_URL || "http://localhost:11434");

    this.continuity.track({
      type: "watchful_state",
      context_before: "Hermes startup",
      event_core: "Hermes Agent booted",
      immediate_result: "Runtime initialized",
      followup_focus: "Verify local tools and Ollama model availability"
    });

    const ollamaModels = await this.commands.run("ollama_list");
    console.log("Available Ollama models:");
    console.log(ollamaModels);

    const utilityManifest = await this.commands.run("utility_manifest");
    console.log("Hermes UtilityTool manifest:");
    console.log(utilityManifest);

    const languageScan = await this.commands.run("language_scan");
    console.log("Hermes language scan:");
    console.log(languageScan);

    const checkPlan = await this.commands.run("check_plan");
    console.log("Hermes multi-language check plan:");
    console.log(checkPlan);

    const response = await this.llm.sendA2A({
      fromAgent: "hermes",
      toAgent: "local-runtime",
      intent: "readiness_check",
      payload: "ตอบสั้น ๆ ภาษาไทยว่า Hermes A2A local agent พร้อมทำงานหรือยัง",
      preferredProvider: process.env.HERMES_LLM_PROVIDER as any
    });
    console.log("LLM response:");
    console.log(response);
  }
}

const hermes = new HermesAgent();

hermes.boot().catch((error) => {
  console.error("Hermes Agent failed:", error);
  process.exit(1);
});
