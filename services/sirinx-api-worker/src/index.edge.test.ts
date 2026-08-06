import assert from 'node:assert/strict';
import test from 'node:test';
import { handleRequest } from './index';

type TestEnv = {
  SIRINX_API_MODE?: string;
  SIRINX_ALLOWED_ORIGIN?: string;
  SIRINX_WORKERS_AI_MODEL?: string;
  SIRINX_AI_SERVER_TOKEN?: string;
  SIRINX_MODEL_GATEWAY_URL?: string;
  ZHIPU_API_KEY?: string;
  ZHIPU_BASE_URL?: string;
  OPENROUTER_API_KEY?: string;
  OPENCLAW_SERVICE?: Fetcher;
  SIRINX_DB?: { connectionString: string };
  AI?: {
    run(model: string, input: Record<string, unknown>): Promise<unknown>;
  };
};

const baseEnv: TestEnv = {
  SIRINX_API_MODE: 'test',
  SIRINX_ALLOWED_ORIGIN: 'https://sirinx.ai',
};

async function json(request: Request, env: TestEnv = baseEnv) {
  const response = await handleRequest(request, env);
  const body = await response.json();
  return { response, body: body as Record<string, unknown> };
}

// ── Routing / HTTP plumbing ─────────────────────────────────────────────────

test('OPTIONS preflight returns 204 with CORS headers', async () => {
  const response = await handleRequest(
    new Request('https://api.sirinx.ai/api/pipeline/plan', {
      method: 'OPTIONS',
      headers: { origin: 'https://sirinx.ai' },
    }),
    baseEnv,
  );
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://sirinx.ai');
  assert.equal(response.headers.get('access-control-allow-methods'), 'GET,POST,OPTIONS');
});

test('unknown path returns 404 JSON', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/nope'));
  assert.equal(response.status, 404);
  assert.equal(body.error, 'Not found');
});

test('trailing slashes normalize to the same route', async () => {
  const { response } = await json(new Request('https://api.sirinx.ai/health/'));
  assert.equal(response.status, 200);
});

test('every route rejects unsupported methods with 405 and Allow header', async () => {
  const cases: Array<[string, string]> = [
    ['/api/runtime/readiness', 'POST'],
    ['/api/ai/server', 'POST'],
    ['/api/ai/compute', 'GET'],
    ['/api/command-center/tool', 'DELETE'],
    ['/api/pipeline/plan', 'PUT'],
    ['/api/openclaw/run', 'DELETE'],
    ['/api/ai-customize', 'GET'],
    ['/api/vision/analyze', 'GET'],
  ];
  for (const [path, method] of cases) {
    const { response, body } = await json(new Request(`https://api.sirinx.ai${path}`, { method }));
    assert.equal(response.status, 405, `${method} ${path} should be 405`);
    assert.equal(body.error, 'Method not allowed');
    assert.ok(response.headers.get('allow'), `${path} should include Allow header`);
  }
});

test('CORS origin is reflected when allowed and falls back when not', async () => {
  const allowed = await handleRequest(
    new Request('https://api.sirinx.ai/health', { headers: { origin: 'https://sirinx.ai' } }),
    baseEnv,
  );
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://sirinx.ai');

  const denied = await handleRequest(
    new Request('https://api.sirinx.ai/health', { headers: { origin: 'https://evil.example' } }),
    baseEnv,
  );
  // Falls back to first allowed origin, never echoes the attacker origin.
  assert.equal(denied.headers.get('access-control-allow-origin'), 'https://sirinx.ai');
});

// ── JSON body parsing / limits ──────────────────────────────────────────────

test('invalid JSON body returns 400', async () => {
  const response = await handleRequest(
    new Request('https://api.sirinx.ai/api/pipeline/plan', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{not json',
    }),
    baseEnv,
  );
  assert.equal(response.status, 400);
  assert.equal((await response.json() as Record<string, unknown>).error, 'Invalid JSON body');
});

test('non-object JSON body returns 400', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/pipeline/plan', {
    method: 'POST',
    body: JSON.stringify([1, 2, 3]),
  }));
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Body must be a JSON object');
});

test('oversized JSON body is rejected with 413 before parsing', async () => {
  const big = JSON.stringify({ businessName: 'x'.repeat(1_100_000) });
  const response = await handleRequest(
    new Request('https://api.sirinx.ai/api/pipeline/plan', {
      method: 'POST',
      headers: { 'content-length': String(big.length) },
      body: big,
    }),
    baseEnv,
  );
  assert.equal(response.status, 413);
});

// ── Runtime readiness ───────────────────────────────────────────────────────

test('runtime readiness reports ready=true when all bindings present', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/runtime/readiness'), {
    ...baseEnv,
    SIRINX_AI_SERVER_TOKEN: 'secret-token',
    SIRINX_DB: { connectionString: 'postgres://x' },
    AI: { async run() { return { response: '' }; } },
    ZHIPU_API_KEY: 'z-key',
    OPENCLAW_SERVICE: {} as Fetcher,
  });
  assert.equal(response.status, 200);
  assert.equal(body.ready, true);
  assert.deepEqual(body.missing, []);
});

test('runtime readiness handles wildcard origin as not-ready for exact origin', async () => {
  const { body } = await json(new Request('https://api.sirinx.ai/api/runtime/readiness'), {
    ...baseEnv,
    SIRINX_ALLOWED_ORIGIN: '*',
  });
  const checks = body.checks as Record<string, Record<string, unknown>>;
  assert.equal(checks.allowedOrigin.ready, false);
});

// ── Workers AI server / compute ─────────────────────────────────────────────

test('ai/server reflects binding when configured', async () => {
  const { body } = await json(new Request('https://api.sirinx.ai/api/ai/server'), {
    ...baseEnv,
    AI: { async run() { return {}; } },
    SIRINX_AI_SERVER_TOKEN: 'tok',
    SIRINX_WORKERS_AI_MODEL: '@cf/meta/llama-3.1-8b-instruct-fast',
  });
  assert.equal(body.bindingConfigured, true);
  assert.equal(body.accessTokenConfigured, true);
  assert.equal(body.defaultModel, '@cf/meta/llama-3.1-8b-instruct-fast');
});

test('ai/compute requires authorization when token is set', async () => {
  let runCalls = 0;
  const env: TestEnv = {
    ...baseEnv,
    SIRINX_AI_SERVER_TOKEN: 'right-token',
    AI: { async run() { runCalls += 1; return { response: 'ok' }; } },
  };
  const noAuth = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'hello' }),
  }), env);
  assert.equal(noAuth.response.status, 401);
  assert.equal(noAuth.body.error, 'authorization_required');

  const wrong = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    headers: { authorization: 'Bearer wrong' },
    body: JSON.stringify({ prompt: 'hello' }),
  }), env);
  assert.equal(wrong.response.status, 403);
  assert.equal(wrong.body.error, 'authorization_denied');

  const xHeader = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    headers: { 'x-sirinx-ai-token': 'right-token' },
    body: JSON.stringify({ prompt: 'hello' }),
  }), env);
  assert.equal(xHeader.response.status, 200);
  assert.equal(runCalls, 1);
});

test('ai/compute validates prompt, model, and unsupported fields', async () => {
  const env: TestEnv = {
    ...baseEnv,
    SIRINX_AI_SERVER_TOKEN: 'tok',
    AI: { async run() { return { response: 'ok' }; } },
  };
  const noPrompt = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    headers: { authorization: 'Bearer tok' },
    body: JSON.stringify({ prompt: '   ' }),
  }), env);
  assert.equal(noPrompt.response.status, 400);

  const tooLong = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    headers: { authorization: 'Bearer tok' },
    body: JSON.stringify({ prompt: 'x'.repeat(20_001) }),
  }), env);
  assert.equal(tooLong.response.status, 413);

  const badModel = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    headers: { authorization: 'Bearer tok' },
    body: JSON.stringify({ prompt: 'hello', model: 'not-cf' }),
  }), env);
  assert.equal(badModel.response.status, 400);

  const extra = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    headers: { authorization: 'Bearer tok' },
    body: JSON.stringify({ prompt: 'hello', n: 2 }),
  }), env);
  assert.equal(extra.response.status, 400);
  assert.deepEqual(extra.body.extra, ['n']);
});

test('ai/compute propagates AI binding failures as 502', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    headers: { authorization: 'Bearer tok' },
    body: JSON.stringify({ prompt: 'hello' }),
  }), {
    ...baseEnv,
    SIRINX_AI_SERVER_TOKEN: 'tok',
    AI: {
      async run() { throw new Error('model exploded'); },
    },
  });
  assert.equal(response.status, 502);
  assert.equal(body.error, 'model exploded');
});

// ── Command center ──────────────────────────────────────────────────────────

test('command-center GET lists available tools and examples', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/command-center/tool'));
  assert.equal(response.status, 200);
  assert.deepEqual(body.availableTools, [
    'status', 'rooms', 'pipeline_plan', 'utility_manifest', 'telegram_commands',
  ]);
});

test('command-center POST resolves tool field and telegram text', async () => {
  const byTool = await json(new Request('https://api.sirinx.ai/api/command-center/tool', {
    method: 'POST',
    body: JSON.stringify({ tool: 'status' }),
  }));
  assert.equal(byTool.body.tool, 'status');
  assert.equal((byTool.body.result as Record<string, unknown>).service, 'sirinx-command-center');

  const byText = await json(new Request('https://api.sirinx.ai/api/command-center/tool', {
    method: 'POST',
    body: JSON.stringify({ telegramText: '/rooms extra args' }),
  }));
  assert.equal(byText.body.tool, 'rooms');

  const unknown = await json(new Request('https://api.sirinx.ai/api/command-center/tool', {
    method: 'POST',
    body: JSON.stringify({ telegramText: '/unknown' }),
  }));
  assert.equal(unknown.response.status, 400);
  assert.equal(unknown.body.error, 'Unknown or disallowed tool');
});

// ── Pipeline plan ───────────────────────────────────────────────────────────

test('pipeline GET returns plan with defaults and no throw on unknown agent ids', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/pipeline/plan'));
  assert.equal(response.status, 200);
  assert.equal(body.objective, 'restore_sirinx_public_website_and_sales_pipeline');
  const stages = body.stages as Array<{ status: string }>;
  assert.ok(stages.length >= 5);
  assert.equal(stages[0].status, 'needs_input');
});

test('pipeline POST with complete facts marks stages ready and sanitizes HTML', async () => {
  const { body } = await json(new Request('https://api.sirinx.ai/api/pipeline/plan', {
    method: 'POST',
    body: JSON.stringify({
      businessName: '<script>alert(1)</script>Bangkok Solar',
      province: 'Phitsanulok',
      monthlyBillThb: 50000,
      roofAreaSqm: 300,
      serviceInterest: 'solar',
      urgency: 'high',
      source: 'website',
    }),
  }));
  const leadFacts = body.leadFacts as Record<string, unknown>;
  assert.equal(leadFacts.businessName, 'Bangkok Solar');
  assert.equal((body.stages as Array<{ status: string }>)[0].status, 'ready');
});

// ── OpenClaw ────────────────────────────────────────────────────────────────

test('openclaw GET lists allowlisted commands', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/openclaw/run'));
  assert.equal(response.status, 200);
  assert.ok((body.availableCommands as string[]).includes('health'));
  assert.equal(body.configured, false);
});

test('openclaw rejects unknown command and proxy injection fields', async () => {
  const unknown = await json(new Request('https://api.sirinx.ai/api/openclaw/run', {
    method: 'POST',
    body: JSON.stringify({ command: 'rm -rf /' }),
  }));
  assert.equal(unknown.response.status, 400);
  assert.equal(unknown.body.success, false);

  const rawField = await json(new Request('https://api.sirinx.ai/api/openclaw/run', {
    method: 'POST',
    body: JSON.stringify({ command: 'status', env: { PATH: '/x' } }),
  }));
  assert.equal(rawField.response.status, 400);
  assert.equal(rawField.body.error, 'Field "env" is not permitted');

  const extraField = await json(new Request('https://api.sirinx.ai/api/openclaw/run', {
    method: 'POST',
    body: JSON.stringify({ command: 'status', sneaky: 1 }),
  }));
  assert.equal(extraField.response.status, 400);
});

test('openclaw POST forwards allowlisted command to service binding', async () => {
  const calls: Array<Request> = [];
  const service = {
    async fetch(input: RequestInfo | URL) {
      calls.push(input instanceof Request ? input : new Request(String(input)));
      return Response.json({ stdout: '{"ok":true}', success: true });
    },
  } as unknown as Fetcher;

  const response = await handleRequest(
    new Request('https://api.sirinx.ai/api/openclaw/run', {
      method: 'POST',
      body: JSON.stringify({ command: 'models' }),
    }),
    { ...baseEnv, OPENCLAW_SERVICE: service },
  );
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  const payload = JSON.parse(await calls[0].text()) as { command: string; args: string[] };
  assert.equal(payload.command, 'models');
  assert.deepEqual(payload.args, ['models', 'status', '--json']);
});

// ── ai-customize ────────────────────────────────────────────────────────────

test('ai-customize validates prompt and falls back deterministically', async () => {
  const missing = await json(new Request('https://api.sirinx.ai/api/ai-customize', {
    method: 'POST',
    body: JSON.stringify({ prompt: '' }),
  }));
  assert.equal(missing.response.status, 400);

  const idle = await json(new Request('https://api.sirinx.ai/api/ai-customize', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'ทุก agent หยุดพัก' }),
  }));
  assert.equal(idle.body.message, 'ทุก agent หยุดพัก');

  const unknown = await json(new Request('https://api.sirinx.ai/api/ai-customize', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'gibberish' }),
  }));
  assert.deepEqual(unknown.body.overrides, {});
});

test('ai-customize uses model gateway when configured and reachable', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const platformFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return Response.json({ ok: true, from: 'gateway' });
  };

  const response = await handleRequest(
    new Request('https://api.sirinx.ai/api/ai-customize', {
      method: 'POST',
      body: JSON.stringify({ model: 'local-model', prompt: 'hello' }),
    }),
    { ...baseEnv, SIRINX_MODEL_GATEWAY_URL: 'https://gateway.test/' },
    undefined,
    { fetch: platformFetch },
  );
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://gateway.test/api/generate');
});

test('ai-customize falls back when gateway fails', async () => {
  const response = await handleRequest(
    new Request('https://api.sirinx.ai/api/ai-customize', {
      method: 'POST',
      body: JSON.stringify({ model: 'local-model', prompt: 'activate L1' }),
    }),
    {
      ...baseEnv,
      SIRINX_MODEL_GATEWAY_URL: 'https://gateway.test/api/',
    },
    undefined,
    {
      async fetch() {
        throw new Error('gateway down');
      },
    },
  );
  const body = await response.json() as Record<string, unknown>;
  assert.equal(response.status, 200);
  assert.equal(body.message, 'L1 Perception กำลังสแกนข้อมูล');
});

// ── Vision analyze ──────────────────────────────────────────────────────────

test('vision analyze validates types and image limits', async () => {
  const missingPrompt = await json(new Request('https://api.sirinx.ai/api/vision/analyze', {
    method: 'POST',
    body: JSON.stringify({ type: 'general', images: ['a'] }),
  }));
  assert.equal(missingPrompt.response.status, 400);

  const tooMany = await json(new Request('https://api.sirinx.ai/api/vision/analyze', {
    method: 'POST',
    body: JSON.stringify({ type: 'general', images: Array(11).fill('a'), prompt: 'x' }),
  }));
  assert.equal(tooMany.response.status, 400);

  const oversized = await json(new Request('https://api.sirinx.ai/api/vision/analyze', {
    method: 'POST',
    body: JSON.stringify({ type: 'general', images: ['a'.repeat(6_000_001)], prompt: 'x' }),
  }));
  assert.equal(oversized.response.status, 400);
});

test('vision analyze returns 503 when no provider key is configured', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/vision/analyze', {
    method: 'POST',
    body: JSON.stringify({ type: 'general', images: ['a'], prompt: 'inspect' }),
  }), baseEnv);
  assert.equal(response.status, 503);
  assert.equal(body.error, 'Vision API not configured - set ZHIPU_API_KEY or OPENROUTER_API_KEY as a Worker secret');
});

test('vision analyze routes to OpenRouter when only that key is set', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fakeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return Response.json({
      choices: [{ message: { content: '{"roofArea":100}' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 20, completion_tokens: 10 },
      model: 'z-ai/glm-5v-turbo',
    });
  };

  const response = await handleRequest(
    new Request('https://api.sirinx.ai/api/vision/analyze', {
      method: 'POST',
      body: JSON.stringify({
        type: 'roof_analysis',
        images: ['abc'],
        prompt: 'assess',
        context: { siteId: 's1' },
      }),
    }),
    { ...baseEnv, OPENROUTER_API_KEY: 'or-key', OPENROUTER_BASE_URL: 'https://openrouter.test/v1' },
    undefined,
    { fetch: fakeFetch },
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].url, 'https://openrouter.test/v1/chat/completions');
  const body = JSON.parse(calls[0].init?.body as string) as {
    model: string;
    messages: Array<{ content: Array<{ type: string; image_url: { url: string } }> }>;
  };
  assert.equal(body.model, 'z-ai/glm-5v-turbo');
  assert.equal(body.messages[0].content[0].image_url.url, 'data:image/jpeg;base64,abc');
});

// ── Sanitization helpers ────────────────────────────────────────────────────

test('pipeline sanitizes numbers and strings defensively', async () => {
  const { body } = await json(new Request('https://api.sirinx.ai/api/pipeline/plan', {
    method: 'POST',
    body: JSON.stringify({
      businessName: '  <b>X</b>  ',
      monthlyBillThb: -500,
      roofAreaSqm: Number.NaN,
      serviceInterest: 'solar',
      urgency: 'high',
    }),
  }));
  const leadFacts = body.leadFacts as Record<string, unknown>;
  assert.equal(leadFacts.businessName, 'X');
  assert.equal(leadFacts.monthlyBillThb, 0);
  assert.equal(leadFacts.roofAreaSqm, 0);
});
