import type { Metadata } from 'next';
import Link from 'next/link';

import { ResetPasswordForm } from '@/features/auth/forms';

export const metadata: Metadata = { title: 'Reset password' };

type Props = { searchParams: Promise<{ uid?: string; token?: string }> };

/** Opened from the link in the password reset email. */
export default async function ResetPasswordPage({ searchParams }: Props) {
  const { uid, token } = await searchParams;

  return (
    <main className="container">
      <h1>Reset password</h1>
      {uid && token ? (
        <ResetPasswordForm uid={uid} token={token} />
      ) : (
        <p className="error">
          This link is incomplete. <Link href="/forgot-password">Request a new one</Link>.
        </p>
      )}
      <p className="muted">
        <Link href="/login">Back to sign in</Link>
      </p>
    </main>
  );
}
