const DEFAULT_DYNAMIC_API_BASE = process.env.NEXT_PUBLIC_SIRINX_API_BASE_URL ?? "";

export function normalizeApiBase(base = DEFAULT_DYNAMIC_API_BASE): string {
  return base.trim().replace(/\/+$/, "");
}

export function normalizeApiPath(path: string): string {
  if (!path.startsWith("/api/")) {
    throw new Error("Dynamic API paths must start with /api/");
  }
  return path;
}

export function buildDynamicApiUrl(path: string, base = DEFAULT_DYNAMIC_API_BASE): string {
  const apiPath = normalizeApiPath(path);
  const apiBase = normalizeApiBase(base);

  return apiBase ? `${apiBase}${apiPath}` : apiPath;
}

export function getDynamicApiBase(): string {
  return normalizeApiBase();
}
