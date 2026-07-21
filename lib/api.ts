const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  url = url.replace(/\/$/, "");
  if (!url.endsWith("/api")) {
    url = url + "/api";
  }
  return url;
};

const API_URL = getApiUrl();
const REQUEST_TIMEOUT_MS = 30_000; // 30 seconds — fail fast, never hang forever

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Authentication is cookie-based (httpOnly) only.
  // localStorage tokens removed — they are vulnerable to XSS theft.
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include', // Always send httpOnly cookies
      signal: controller.signal,
    });

    if (response.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/sign-in") {
        window.location.href = '/sign-in';
      }
      throw new Error('Not authenticated');
    }
    if (response.status === 429) {
      throw new Error('Too many requests. Please wait a moment.');
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Request failed (${response.status})`);
    }
    return response.json();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get:    <T>(path: string) => apiFetch<T>(path),
  post:   <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000); // 2 min for file upload
    return fetch(`${API_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      signal: controller.signal,
    }).then(async r => {
      clearTimeout(timeoutId);
      if (r.status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/sign-in") {
          window.location.href = '/sign-in';
        }
        throw new Error('Not authenticated');
      }
      if (!r.ok) {
        const error = await r.json().catch(() => ({}));
        throw new Error(error.detail || `Upload failed (${r.status})`);
      }
      return r.json();
    }).catch(err => {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Upload timed out. Please try a smaller file.');
      }
      throw err;
    }) as Promise<T>;
  },
}
