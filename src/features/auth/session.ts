import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';

import { ApiError, api } from '@/lib/api';

import type { User } from './types';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

export type Tokens = { access: string; refresh: string };

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  expires: Date;
};

/** Both `cookies()` and `NextResponse.cookies` fit this shape. */
type CookieJar = { set(name: string, value: string, options: CookieOptions): unknown };

/** Reads a JWT's `exp` so the cookie expires together with the token. */
function expiresAt(jwt: string): Date {
  const payload: unknown = JSON.parse(Buffer.from(jwt.split('.')[1] ?? '', 'base64url').toString());
  const exp = (payload as { exp?: unknown }).exp;
  if (typeof exp !== 'number') throw new Error('Token has no expiry');
  return new Date(exp * 1000);
}

function cookieOptions(token: string): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt(token),
  };
}

export function writeTokens(jar: CookieJar, tokens: Tokens) {
  jar.set(ACCESS_COOKIE, tokens.access, cookieOptions(tokens.access));
  jar.set(REFRESH_COOKIE, tokens.refresh, cookieOptions(tokens.refresh));
}

export async function clearTokens() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

/** The signed-in user, or `null`. Cached so a request asks the backend at most once. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    return await api<User>('/api/auth/me/', { token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});
