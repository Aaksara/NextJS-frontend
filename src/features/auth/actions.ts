'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { api } from '@/lib/api';

import { toFormState } from './form-errors';
import { REFRESH_COOKIE, type Tokens, clearTokens, getAccessToken, writeTokens } from './session';
import type { FormState } from './types';

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const tokens = await api<Tokens>('/api/auth/login/', {
      method: 'POST',
      body: { email: field(formData, 'email'), password: field(formData, 'password') },
    });
    writeTokens(await cookies(), tokens);
  } catch (error) {
    return toFormState(error);
  }
  redirect('/');
}

export async function register(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await api('/api/auth/register/', {
      method: 'POST',
      body: {
        email: field(formData, 'email'),
        full_name: field(formData, 'full_name'),
        password: field(formData, 'password'),
      },
    });
  } catch (error) {
    return toFormState(error);
  }
  return { message: 'Account created. Check your university email for a verification link.' };
}

export async function requestPasswordReset(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await api('/api/auth/password/reset/', {
      method: 'POST',
      body: { email: field(formData, 'email') },
    });
  } catch (error) {
    return toFormState(error);
  }
  return { message: 'If an account exists for that email, a reset link has been sent.' };
}

export async function resetPassword(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await api('/api/auth/password/reset/confirm/', {
      method: 'POST',
      body: {
        uid: field(formData, 'uid'),
        token: field(formData, 'token'),
        new_password: field(formData, 'new_password'),
      },
    });
  } catch (error) {
    return toFormState(error);
  }
  return { message: 'Your password has been reset. You can now sign in.' };
}

export async function logout() {
  const token = await getAccessToken();
  const refresh = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (token && refresh) {
    // Best effort: the cookies are cleared either way.
    await api('/api/auth/logout/', { method: 'POST', body: { refresh }, token }).catch(
      (error: unknown) => console.error('Logout request failed', error),
    );
  }
  await clearTokens();
  redirect('/login');
}
