const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  // Remove trailing slash if present
  url = url.replace(/\/$/, "");
  // Append /api if not present at the end
  if (!url.endsWith("/api")) {
    url = url + "/api";
  }
  return url;
};

const API_URL = getApiUrl();

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("archvise_token") : null;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Prevent redirect loop in sign-in page
    if (typeof window !== "undefined" && window.location.pathname !== "/sign-in") {
      window.location.href = '/sign-in'
    }
    throw new Error('Not authenticated')
  }
  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment.')
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Something went wrong')
  }
  return response.json()
}

export const api = {
  get:    <T>(path: string) => apiFetch<T>(path),
  post:   <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("archvise_token") : null;
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return fetch(`${API_URL}${path}`, { 
      method: 'POST', 
      headers,
      body: formData 
    }).then(r => {
      if (r.status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/sign-in") {
          window.location.href = '/sign-in'
        }
        throw new Error('Not authenticated')
      }
      if (!r.ok) {
        throw new Error('Upload failed')
      }
      return r.json()
    }) as Promise<T>;
  },
}
