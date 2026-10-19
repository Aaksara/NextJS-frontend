import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/features/auth/forms';
import { getCurrentUser } from '@/features/auth/session';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect('/');

  return (
    <main className="container">
      <h1>Sign in</h1>
      <LoginForm />
      <p className="muted">
        New here? <Link href="/register">Create an account</Link>
      </p>
    </main>
  );
}
