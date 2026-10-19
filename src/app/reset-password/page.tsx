import Link from 'next/link';

import { Form } from '@/components/form';

export const metadata = { title: 'Reset password' };

type Props = { searchParams: Promise<{ uid?: string; token?: string }> };

/** Opened from the link in the password reset email. */
export default async function ResetPasswordPage({ searchParams }: Props) {
  const { uid = '', token = '' } = await searchParams;

  return (
    <main className="container">
      <h1>Reset password</h1>
      <Form
        path="/api/auth/password/reset/confirm/"
        submitLabel="Set new password"
        successMessage="Your password has been reset. You can now sign in."
        extra={{ uid, token }}
        fields={[
          {
            name: 'new_password',
            label: 'New password',
            type: 'password',
            autoComplete: 'new-password',
          },
        ]}
      />
      <p className="muted">
        <Link href="/login">Sign in</Link>
      </p>
    </main>
  );
}
