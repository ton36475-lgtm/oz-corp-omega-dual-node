import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { handleRequest } from './index';

type TestEnv = {
  SIRINX_API_MODE?: string;
  SIRINX_ALLOWED_ORIGIN?: string;
  SIRINX_WORKERS_AI_MODEL?: string;
  SIRINX_AI_SERVER_TOKEN?: string;
  ZHIPU_API_KEY?: string;
  ZHIPU_BASE_URL?: string;
  OPENROUTER_API_KEY?: string;
  OPENCLAW_SERVICE?: Fetcher;
  SIRINX_DB?: { connectionString: string };
  AI?: {
    run(model: string, input: Record<string, unknown>): Promise<unknown>;
  };
};

const env: TestEnv = {
  SIRINX_API_MODE: 'test',
  SIRINX_ALLOWED_ORIGIN: 'https://sirinx.ai',
};
const ctx = {
  waitUntil() {},
  passThroughOnException() {},
} as unknown as ExecutionContext;

async function json(request: Request, testEnv: TestEnv = env) {
  const response = await handleRequest(request, testEnv);
  const body = await response.json();
  return { response, body: body as Record<string, unknown> };
}

test('health identifies the production Worker runtime', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/health'));

  assert.equal(response.status, 200);
  assert.equal(body.runtime, 'cloudflare-worker');
  assert.equal(body.dynamicPostRuntime, true);
  assert.ok((body.routes as string[]).includes('/api/ai/compute'));
});

test('runtime readiness reports missing production bindings without exposing secrets', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/runtime/readiness'));

  assert.equal(response.status, 200);
  assert.equal(body.ready, false);
  assert.deepEqual(body.missing, [
    'workers_ai_binding',
    'ai_server_access_token',
    'vision_provider_secret',
    'openclaw_service_binding',
    'database_binding',
  ]);

  const checks = body.checks as Record<string, Record<string, unknown>>;
  assert.equal(checks.allowedOrigin.ready, true);
  assert.equal(checks.workersAiBinding.ready, false);
  assert.equal(checks.aiServerAccessToken.ready, false);
  assert.equal(checks.visionProviderSecret.ready, false);
  assert.equal(checks.openclawServiceBinding.ready, false);
  assert.equal(checks.databaseBinding.ready, false);
  assert.equal(JSON.stringify(body).includes('test-key'), false);
});

test('Workers AI server exposes compute readiness and runs a prompt through the AI binding', async () => {
  const offline = await json(new Request('https://api.sirinx.ai/api/ai/server'));

  assert.equal(offline.response.status, 200);
  assert.equal(offline.body.provider, 'cloudflare-workers-ai');
  assert.equal(offline.body.bindingConfigured, false);
  assert.equal(offline.body.defaultModel, '@cf/meta/llama-3.1-8b-instruct');

  const noBinding = await json(new Request('https://api.sirinx.ai/api/ai/compute', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'Summarize SIRINX in one line.' }),
  }));

  assert.equal(noBinding.response.status, 503);
  assert.equal(noBinding.body.error, 'workers_ai_binding_unavailable');

  const noToken = await json(
    new Request('https://api.sirinx.ai/api/ai/compute', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Summarize SIRINX in one line.',
        max_tokens: 128,
        temperature: 0.2,
      }),
    }),
    {
      ...env,
      SIRINX_WORKERS_AI_MODEL: '@cf/meta/llama-3.1-8b-instruct',
      AI: {
        async run(model, input) {
          assert.fail(`AI binding should not be called without access token: ${model} ${JSON.stringify(input)}`);
        },
      },
    },
  );

  assert.equal(noToken.response.status, 503);
  assert.equal(noToken.body.error, 'ai_server_access_token_unavailable');

  const calls: Array<{ model: string; input: Record<string, unknown> }> = [];
  const withBinding = await json(
    new Request('https://api.sirinx.ai/api/ai/compute', {
      method: 'POST',
      headers: { authorization: 'Bearer test-token' },
      body: JSON.stringify({
        prompt: 'Summarize SIRINX in one line.',
        max_tokens: 128,
        temperature: 0.2,
      }),
    }),
    {
      ...env,
      SIRINX_AI_SERVER_TOKEN: 'test-token',
      SIRINX_WORKERS_AI_MODEL: '@cf/meta/llama-3.1-8b-instruct',
      AI: {
        async run(model, input) {
          calls.push({ model, input });
          return { response: 'SIRINX is an AI-enabled solar operations platform.' };
        },
      },
    },
  );

  assert.equal(withBinding.response.status, 200);
  assert.equal(withBinding.body.success, true);
  assert.equal(withBinding.body.model, '@cf/meta/llama-3.1-8b-instruct');
  assert.equal(withBinding.body.text, 'SIRINX is an AI-enabled solar operations platform.');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].model, '@cf/meta/llama-3.1-8b-instruct');
  assert.equal(calls[0].input.prompt, 'Summarize SIRINX in one line.');
  assert.equal(calls[0].input.max_tokens, 128);
});

test('command-center POST accepts telegram command text and rejects extra fields', async () => {
  const good = await json(new Request('https://api.sirinx.ai/api/command-center/tool', {
    method: 'POST',
    body: JSON.stringify({ telegramText: '/pipeline now' }),
  }));

  assert.equal(good.response.status, 200);
  assert.equal(good.body.tool, 'pipeline_plan');
  assert.deepEqual(good.response.headers.get('access-control-allow-origin'), 'https://sirinx.ai');

  const bad = await json(new Request('https://api.sirinx.ai/api/command-center/tool', {
    method: 'POST',
    body: JSON.stringify({ tool: 'status', shell: 'rm -rf /' }),
  }));

  assert.equal(bad.response.status, 400);
  assert.deepEqual(bad.body.error, 'Unsupported fields');
});

test('pipeline POST validates allowed lead fact fields and returns a plan', async () => {
  const good = await json(new Request('https://api.sirinx.ai/api/pipeline/plan', {
    method: 'POST',
    body: JSON.stringify({
      businessName: '<b>SIRINX Factory</b>',
      province: 'Phitsanulok',
      monthlyBillThb: 125000.25,
      roofAreaSqm: 720.8,
      serviceInterest: 'solar',
      urgency: 'high',
      source: 'website',
    }),
  }));

  assert.equal(good.response.status, 200);
  const leadFacts = good.body.leadFacts as Record<string, unknown>;
  assert.equal(leadFacts.businessName, 'SIRINX Factory');
  assert.equal(leadFacts.monthlyBillThb, 125000);
  assert.equal(good.body.objective, 'restore_sirinx_public_website_and_sales_pipeline');

  const bad = await json(new Request('https://api.sirinx.ai/api/pipeline/plan', {
    method: 'POST',
    body: JSON.stringify({ businessName: 'x', api_key: 'not-allowed' }),
  }));

  assert.equal(bad.response.status, 400);
  assert.deepEqual(bad.body.error, 'Unsupported lead fact fields');
});

test('openclaw Worker route preserves allowlist and never accepts raw execution fields', async () => {
  const blocked = await json(new Request('https://api.sirinx.ai/api/openclaw/run', {
    method: 'POST',
    body: JSON.stringify({ command: 'status', argv: ['status'] }),
  }));

  assert.equal(blocked.response.status, 400);
  assert.equal(blocked.body.error, 'Field "argv" is not permitted');

  const noBinding = await json(new Request('https://api.sirinx.ai/api/openclaw/run', {
    method: 'POST',
    body: JSON.stringify({ command: 'status' }),
  }));

  assert.equal(noBinding.response.status, 503);
  assert.equal(noBinding.body.success, false);
  assert.equal(noBinding.body.fullCmd, '(not executed - service binding unavailable)');
});

test('ai-customize POST uses deterministic fallback without local loopback dependency', async () => {
  const { response, body } = await json(new Request('https://api.sirinx.ai/api/ai-customize', {
    method: 'POST',
    body: JSON.stringify({ model: 'worker-fallback', prompt: 'activate L2 วิเคราะห์' }),
  }));

  assert.equal(response.status, 200);
  assert.equal(body.message, 'L2 Analysis กำลังวิเคราะห์ข้อมูล');
  assert.ok((body.overrides as Record<string, string>)['agent-18-financial-analysis']);
});

test('vision analysis validates images and can call a configured provider', async () => {
  const invalid = await json(new Request('https://api.sirinx.ai/api/vision/analyze', {
    method: 'POST',
    body: JSON.stringify({ type: 'general', images: [], prompt: 'inspect' }),
  }));

  assert.equal(invalid.response.status, 400);

  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fakeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return Response.json({
      choices: [{ message: { content: '{"ok":true}' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 10, completion_tokens: 5 },
      model: 'glm-5v-turbo',
    });
  };

  const response = await handleRequest(
    new Request('https://api.sirinx.ai/api/vision/analyze', {
      method: 'POST',
      body: JSON.stringify({
        type: 'general',
        images: ['abc123'],
        prompt: 'inspect roof',
      }),
    }),
    { ...env, ZHIPU_API_KEY: 'test-key', ZHIPU_BASE_URL: 'https://zhipu.test/v4' },
    undefined,
    { fetch: fakeFetch },
  );
  const body = await response.json() as Record<string, unknown>;

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.content, '{"ok":true}');
  assert.equal(body.model, 'glm-5v-turbo');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://zhipu.test/v4/chat/completions');
});

test('default export delegates to handleRequest', async () => {
  const response = await worker.fetch(new Request('https://api.sirinx.ai/health'), env as Env, ctx);
  assert.equal(response.status, 200);
});
