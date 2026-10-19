const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// Calls that must not trigger a token refresh when they return 401.
const NO_REFRESH = ['/api/auth/login/', '/api/auth/token/refresh/'];

/** An error response: a message plus the messages for each form field. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly fields: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

function send(path: string, body?: object) {
  return fetch(API_URL + path, {
    method: body ? 'POST' : 'GET',
    credentials: 'include', // the backend keeps the session in httpOnly cookies
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** GET when there is no body, POST when there is one. */
export async function api<T = unknown>(path: string, body?: object): Promise<T> {
  let response = await send(path, body);
  if (response.status === 401 && !NO_REFRESH.includes(path)) {
    const refreshed = await send('/api/auth/token/refresh/', {});
    if (refreshed.ok) response = await send(path, body);
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (response.ok) return data as T;

  // Django REST Framework errors look like {"detail": "..."} or {"field": ["..."]}.
  const fields: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(data ?? {})) {
    if (Array.isArray(value)) fields[key] = value.map(String);
  }
  const fallback = Object.keys(fields).length ? '' : 'Something went wrong. Please try again.';
  throw new ApiError(data?.detail ?? fields.non_field_errors?.join(' ') ?? fallback, fields);
}
