import { type NextRequest, NextResponse } from 'next/server';

import { ApiError, api } from '@/lib/api';

import { ACCESS_COOKIE, REFRESH_COOKIE, type Tokens, writeTokens } from './features/auth/session';

/**
 * Renews the access token before the page renders. Server Components cannot set cookies,
 * so this is the one place a rotated refresh token can be saved.
 */
export async function proxy(request: NextRequest) {
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (request.cookies.has(ACCESS_COOKIE) || !refresh) return NextResponse.next();

  try {
    const tokens = await api<Tokens>('/api/auth/token/refresh/', {
      method: 'POST',
      body: { refresh },
      forwardedFor: request.headers.get('x-forwarded-for'),
    });
    // Make the new token visible to this request's render, then to the browser.
    request.cookies.set(ACCESS_COOKIE, tokens.access);
    request.cookies.set(REFRESH_COOKIE, tokens.refresh);
    const response = NextResponse.next({ request });
    writeTokens(response.cookies, tokens);
    return response;
  } catch (error) {
    const response = NextResponse.next();
    // A rejected refresh token is dead; any other failure may be temporary.
    if (error instanceof ApiError && error.status === 401) response.cookies.delete(REFRESH_COOKIE);
    else console.error('Token refresh failed', error);
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/|api/|icons/|sw.js|manifest.webmanifest|offline).*)'],
};
