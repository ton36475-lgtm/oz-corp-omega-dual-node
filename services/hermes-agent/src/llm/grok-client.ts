import type { GenerateOptions, LlmClient } from "./types.js";

interface GrokChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export class GrokClient implements LlmClient {
  readonly name = "grok" as const;
  private baseUrl: string;
  private defaultModel: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.GROK_BASE_URL || process.env.XAI_BASE_URL || "https://api.x.ai/v1";
    this.defaultModel = process.env.GROK_MODEL || process.env.XAI_MODEL || "grok-4";
    this.apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY || "";
  }

  isConfigured(): boolean {
    return this.apiKey.trim().length > 0;
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Grok API key is not configured. Set GROK_API_KEY or XAI_API_KEY.");
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        messages: [
          {
            role: "system",
            content:
              options.system ||
              "You are Hermes Grok route, a concise A2A engineering assistant. Do defensive security only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: options.temperature ?? 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`Grok request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as GrokChatResponse;
    return data.choices?.[0]?.message?.content || "";
  }
}

