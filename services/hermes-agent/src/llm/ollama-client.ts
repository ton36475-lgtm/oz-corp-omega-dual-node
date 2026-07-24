import type { GenerateOptions, LlmClient } from "./types.js";

export class OllamaClient implements LlmClient {
  readonly name = "ollama" as const;
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.defaultModel = process.env.OLLAMA_DEFAULT_MODEL || "llama3.2:3b";
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        system:
          options.system ||
          "You are Hermes Agent, a local OZ-CORP operational agent running on the user's Mac via Ollama. Answer directly and briefly. Do defensive security only.",
        prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || "";
  }
}
