export type LlmProviderName = "ollama" | "grok";

export interface GenerateOptions {
  model?: string;
  system?: string;
  temperature?: number;
}

export interface LlmClient {
  readonly name: LlmProviderName;
  generate(prompt: string, options?: GenerateOptions): Promise<string>;
}

