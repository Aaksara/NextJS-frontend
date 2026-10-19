import Link from 'next/link';

import { Form } from '@/components/form';

export const metadata = { title: 'Verify email' };

type Props = { searchParams: Promise<{ uid?: string; token?: string }> };

/** Opened from the link in the verification email. */
export default async function VerifyEmailPage({ searchParams }: Props) {
  const { uid = '', token = '' } = await searchParams;

  return (
    <main className="container">
      <h1>Verify email</h1>
      <Form
        path="/api/auth/verify-email/"
        submitLabel="Verify my email"
        successMessage="Your email is verified. You can now sign in."
        extra={{ uid, token }}
        fields={[]}
      />
      <p className="muted">
        <Link href="/login">Sign in</Link>
      </p>
    </main>
  );
}
