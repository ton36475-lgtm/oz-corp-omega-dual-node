import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDynamicApiUrl,
  normalizeApiBase,
  normalizeApiPath,
} from "./api-runtime.ts";

test("buildDynamicApiUrl keeps same-origin URLs when no Worker base is configured", () => {
  assert.equal(buildDynamicApiUrl("/api/openclaw/run", ""), "/api/openclaw/run");
});

test("buildDynamicApiUrl joins a configured Worker base with an API path", () => {
  assert.equal(
    buildDynamicApiUrl("/api/openclaw/run", "https://api.sirinx.ai/"),
    "https://api.sirinx.ai/api/openclaw/run",
  );
});

test("normalizeApiBase trims whitespace and trailing slashes", () => {
  assert.equal(normalizeApiBase(" https://api.sirinx.ai/// "), "https://api.sirinx.ai");
});

test("normalizeApiPath requires a leading /api path", () => {
  assert.throws(
    () => normalizeApiPath("openclaw/run"),
    /Dynamic API paths must start with \/api\//,
  );
});
