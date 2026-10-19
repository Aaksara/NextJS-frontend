import 'server-only';

import { headers } from 'next/headers';

import { getServerEnv } from './env';

/** A DRF error body: `{ "detail": "..." }` or `{ "<field>": ["..."] }`. */
export type ApiErrorBody = Record<string, unknown>;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(typeof body.detail === 'string' ? body.detail : `Request failed with ${status}`);
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
  /** Read from the incoming request when omitted; `proxy.ts` must pass it explicitly. */
  forwardedFor?: string | null;
};

/** Calls the Django API from the server. Throws `ApiError` on a non-2xx response. */
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  const forwardedFor =
    options.forwardedFor === undefined
      ? (await headers()).get('x-forwarded-for')
      : options.forwardedFor;

  const requestHeaders = new Headers({ Accept: 'application/json' });
  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json');
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  // Lets the backend rate-limit the real client rather than this server.
  if (forwardedFor) requestHeaders.set('X-Forwarded-For', forwardedFor);

  const response = await fetch(new URL(path, getServerEnv().API_URL), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });

  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, data as ApiErrorBody);
  return data as T;
}
