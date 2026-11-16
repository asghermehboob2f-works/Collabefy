// src/lib/api-client.ts
// Centralized fetch wrapper for all internal API calls

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

type FetchOptions = RequestInit & {
  timeout?: number;
};

export async function apiGet<T>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, method: 'GET' });
}

export async function apiPost<T>(path: string, body: unknown, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(body),
  });
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 10000, ...init } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...init, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}
