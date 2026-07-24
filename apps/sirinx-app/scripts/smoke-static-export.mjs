import { readFile } from 'node:fs/promises';
import { createStaticExportServer } from './serve-static-export.mjs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function getJson(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert(response.ok, `${path} returned ${response.status}`);
  return response.json();
}

const server = createStaticExportServer();

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

try {
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const home = await fetch(`${baseUrl}/`);
  assert(home.ok, `/ returned ${home.status}`);
  const homeHtml = await home.text();
  assert(homeHtml.includes('<html'), 'home page did not return HTML');

  const status = await getJson(baseUrl, '/api/command-center/status');
  assert(status.service === 'oz-corp-command-center', 'command center status service mismatch');
  assert(status.endpoints.openclawAllowlist === '/api/openclaw/run', 'OpenClaw endpoint missing from status');
  assert(status.productionRuntime.worker === 'sirinx-api-worker', 'production Worker runtime missing from status');
  assert(
    status.productionRuntime.readiness === '/api/runtime/readiness',
    'production Worker readiness route missing from status',
  );
  assert(
    status.productionRuntime.dynamicPostRoutes.includes('/api/vision/analyze'),
    'dynamic production POST routes missing vision API',
  );
  assert(
    status.productionRuntime.dynamicPostRoutes.includes('/api/ai/compute'),
    'dynamic production POST routes missing Workers AI compute API',
  );
  assert(Array.isArray(status.telegramCommands), 'telegram commands missing from status payload');

  const models = await getJson(baseUrl, '/api/models');
  assert(Array.isArray(models.models), 'models payload missing model list');

  const openClawRoute = await readFile(new URL('../src/app/api/openclaw/run/route.ts', import.meta.url), 'utf8');
  for (const blocked of ['argv', 'args', 'shell', 'env', 'cwd', 'exec', 'stdin']) {
    assert(openClawRoute.includes(`"${blocked}"`), `OpenClaw allowlist does not reject ${blocked}`);
  }
  assert(openClawRoute.includes('ALLOWED_COMMANDS'), 'OpenClaw route missing ALLOWED_COMMANDS');

  console.log(`Static export smoke passed at ${baseUrl}`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
