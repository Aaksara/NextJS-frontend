import type { Metadata } from 'next';
import Link from 'next/link';

import { toFormState } from '@/features/auth/form-errors';
import { api } from '@/lib/api';

export const metadata: Metadata = { title: 'Verify email' };

type Props = { searchParams: Promise<{ uid?: string; token?: string }> };

async function verify(uid: string, token: string): Promise<string | null> {
  try {
    await api('/api/auth/verify-email/', { method: 'POST', body: { uid, token } });
    return null;
  } catch (error) {
    return toFormState(error).error ?? 'This link is invalid or has expired.';
  }
}

/** Opened from the link in the verification email. */
export default async function VerifyEmailPage({ searchParams }: Props) {
  const { uid, token } = await searchParams;
  const error = uid && token ? await verify(uid, token) : 'This link is incomplete.';

  return (
    <main className="container">
      <h1>Verify email</h1>
      {error ? <p className="error">{error}</p> : <p role="status">Your email is verified.</p>}
      <p>
        <Link href="/login">Sign in</Link>
      </p>
    </main>
  );
}
