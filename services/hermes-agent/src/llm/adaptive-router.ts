import { GrokClient } from "./grok-client.js";
import { OllamaClient } from "./ollama-client.js";
import type { GenerateOptions, LlmClient, LlmProviderName } from "./types.js";

export interface A2ATask {
  fromAgent: string;
  toAgent: string;
  intent: string;
  payload: string;
  preferredProvider?: LlmProviderName;
}

export class AdaptiveA2ARouter {
  private ollama = new OllamaClient();
  private grok = new GrokClient();

  private getClient(provider?: LlmProviderName): LlmClient {
    if (provider === "grok") return this.grok;
    if (provider === "ollama") return this.ollama;

    const mode = process.env.HERMES_LLM_MODE || "adaptive";
    if (mode === "grok") return this.grok;
    return this.ollama;
  }

  async generate(prompt: string, options: GenerateOptions & { provider?: LlmProviderName } = {}): Promise<string> {
    const primary = this.getClient(options.provider);
    const fallback = primary.name === "grok" ? this.ollama : this.grok;

    try {
      return await primary.generate(prompt, options);
    } catch (error) {
      if (fallback.name === "grok" && !this.grok.isConfigured()) {
        throw error;
      }
      return fallback.generate(prompt, options);
    }
  }

  async sendA2A(task: A2ATask): Promise<string> {
    const prompt = JSON.stringify(
      {
        protocol: "A2A",
        fromAgent: task.fromAgent,
        toAgent: task.toAgent,
        intent: task.intent,
        payload: task.payload
      },
      null,
      2
    );

    return this.generate(prompt, {
      provider: task.preferredProvider,
      system:
        "You route agent-to-agent work. Return concise JSON with fields: accepted, summary, next_action. Defensive and authorized work only."
    });
  }
}

