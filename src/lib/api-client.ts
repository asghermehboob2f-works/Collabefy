// src/lib/api-client.ts
// Robust production API client for Collabefy

const API_BASE = typeof window !== "undefined" ? "" : process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

type FetchOptions = RequestInit & {
  timeout?: number;
};

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const adminToken = localStorage.getItem("collabefy_admin_token");
    if (adminToken) {
      return { Authorization: `Bearer ${adminToken}` };
    }
    const userToken = localStorage.getItem("collabefy_token");
    if (userToken) {
      return { Authorization: `Bearer ${userToken}` };
    }
  }
  return {};
}

export async function apiGet<T>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, method: "GET" });
}

export async function apiPost<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, method: "DELETE" });
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 12000, ...init } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  // Ensure path starts with /api/v1 if not present
  const normalizedPath = path.startsWith("/api/v1") ? path : `/api/v1${path.startsWith("/") ? path : `/${path}`}`;
  const url = `${API_BASE}${normalizedPath}`;

  try {
    const headers = {
      ...getAuthHeader(),
      ...init.headers,
    };

    const res = await fetch(url, {
      ...init,
      headers,
      credentials: "include", // send/receive HttpOnly cookies
      signal: controller.signal,
    });
    clearTimeout(id);

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errMsg = json?.error?.message || json?.error || json?.message || `HTTP ${res.status}`;
      throw new Error(errMsg);
    }
    return json as T;
  } catch (err: any) {
    clearTimeout(id);
    throw err;
  }
}
