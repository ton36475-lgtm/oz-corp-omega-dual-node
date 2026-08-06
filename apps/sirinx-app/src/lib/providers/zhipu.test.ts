import assert from "node:assert/strict";
import test from "node:test";

import { ZhipuClient } from "./zhipu.ts";

type FetchCall = { url: string; init?: RequestInit };

function mockFetch(calls: FetchCall[], responseBody: unknown) {
  const original = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  return () => { globalThis.fetch = original; };
}

test("ZhipuClient routes to OpenRouter when only OPENROUTER_API_KEY is set", async () => {
  const calls: FetchCall[] = [];
  const restore = mockFetch(calls, {
    choices: [{ message: { content: '{"roofArea":100}' }, finish_reason: "stop" }],
    usage: { prompt_tokens: 10, completion_tokens: 5 },
    model: "z-ai/glm-5v-turbo",
  });

  try {
    const client = new ZhipuClient({ openrouterApiKey: "or-key" });
    assert.equal(client.isConfigured, true);
    assert.equal(client.defaultModel, "z-ai/glm-5v-turbo");

    const result = await client.generate("inspect", { images: ["abc"], temperature: 0.2 });
    assert.equal(result.content, '{"roofArea":100}');
    assert.equal(result.model, "z-ai/glm-5v-turbo");
    assert.equal(result.inputTokens, 10);
    assert.equal(result.outputTokens, 5);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://openrouter.ai/api/v1/chat/completions");
    const headers = new Headers(calls[0].init?.headers);
    assert.equal(headers.get("authorization"), "Bearer or-key");
    assert.equal(headers.get("http-referer"), "https://sirinx.ai");

    const body = JSON.parse(calls[0].init?.body as string) as {
      model: string;
      messages: Array<{ content: Array<{ type: string; text?: string; image_url?: { url: string } }> }>;
    };
    assert.equal(body.model, "z-ai/glm-5v-turbo");
    assert.equal(body.messages[0].content[0].image_url?.url, "data:image/jpeg;base64,abc");
    assert.equal(body.messages[0].content[1].text, "inspect");
  } finally {
    restore();
  }
});

test("ZhipuClient uses direct Zhipu base URL when ZHIPU_API_KEY is set", async () => {
  const calls: FetchCall[] = [];
  const restore = mockFetch(calls, {
    choices: [{ message: { content: "ok" }, finish_reason: "stop" }],
    usage: { prompt_tokens: 2, completion_tokens: 2 },
    model: "glm-5v-turbo",
  });

  try {
    const client = new ZhipuClient({ apiKey: "z-key", baseUrl: "https://zhipu.test/v4" });
    assert.equal(client.isConfigured, true);
    assert.equal(client.defaultModel, "glm-5v-turbo");
    await client.generate("hello");
    assert.equal(calls[0].url, "https://zhipu.test/v4/chat/completions");
    const headers = new Headers(calls[0].init?.headers);
    assert.equal(headers.get("authorization"), "Bearer z-key");
    assert.equal(headers.get("http-referer"), null);
  } finally {
    restore();
  }
});

test("ZhipuClient throws when unconfigured", async () => {
  const saved = {
    ZHIPU_API_KEY: process.env.ZHIPU_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    ZHIPU_BASE_URL: process.env.ZHIPU_BASE_URL,
  };
  delete process.env.ZHIPU_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.ZHIPU_BASE_URL;
  try {
    const client = new ZhipuClient({});
    assert.equal(client.isConfigured, false);
    await assert.rejects(() => client.generate("hello"), /no API key configured/);
  } finally {
    if (saved.ZHIPU_API_KEY !== undefined) process.env.ZHIPU_API_KEY = saved.ZHIPU_API_KEY;
    if (saved.OPENROUTER_API_KEY !== undefined) process.env.OPENROUTER_API_KEY = saved.OPENROUTER_API_KEY;
    if (saved.ZHIPU_BASE_URL !== undefined) process.env.ZHIPU_BASE_URL = saved.ZHIPU_BASE_URL;
  }
});

test("ZhipuClient surfaces non-OK provider responses as errors", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response("rate limited", { status: 429 });
  try {
    const client = new ZhipuClient({ apiKey: "z-key" });
    await assert.rejects(() => client.generate("hello"), /Zhipu API 429/);
  } finally {
    globalThis.fetch = original;
  }
});

test("ZhipuClient parses tool calls and malformed JSON arguments", async () => {
  const calls: FetchCall[] = [];
  const restore = mockFetch(calls, {
    choices: [{
      message: {
        content: "",
        tool_calls: [
          { id: "t1", function: { name: "lookup", arguments: '{"q":"x"}' } },
          { id: "t2", function: { name: "broken", arguments: "not json" } },
        ],
      },
      finish_reason: "tool_calls",
    }],
    usage: { prompt_tokens: 5, completion_tokens: 3 },
    model: "glm-5v-turbo",
  });

  try {
    const client = new ZhipuClient({ apiKey: "z-key" });
    const result = await client.generate("do it", {
      tools: [{ name: "lookup", description: "lookup" }],
    });
    assert.equal(result.toolCalls?.length, 2);
    assert.deepEqual(result.toolCalls?.[0], { id: "t1", name: "lookup", input: { q: "x" } });
    assert.deepEqual(result.toolCalls?.[1], { id: "t2", name: "broken", input: {} });
    assert.equal(result.finishReason, "tool_calls");
  } finally {
    restore();
  }
});

test("analyzeRoof parses JSON from model content", async () => {
  const calls: FetchCall[] = [];
  const restore = mockFetch(calls, {
    choices: [{
      message: {
        content: 'Some preamble {"roofArea":{"total":120,"usable":90,"unit":"sqm"},"orientation":{"direction":"south","tiltAngle":15},"obstructions":[],"roofCondition":{"material":"tile","estimatedAge":5,"strength":"good"},"solarPotential":{"estimatedKwp":20,"annualKwh":28000,"suitabilityScore":85},"recommendations":["clean gutters"],"notes":"ok"}',
      },
      finish_reason: "stop",
    }],
    usage: { prompt_tokens: 10, completion_tokens: 20 },
    model: "glm-5v-turbo",
  });

  try {
    const client = new ZhipuClient({ apiKey: "z-key" });
    const { raw, parsed } = await client.analyzeRoof(["img"]);
    assert.ok(parsed);
    assert.equal(parsed?.solarPotential.estimatedKwp, 20);
    assert.equal(parsed?.orientation.direction, "south");
    assert.ok(raw.content.length > 0);
  } finally {
    restore();
  }
});
