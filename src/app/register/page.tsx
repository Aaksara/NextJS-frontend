import type { Metadata } from 'next';
import Link from 'next/link';

import { RegisterForm } from '@/features/auth/forms';

export const metadata: Metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <main className="container">
      <h1>Create account</h1>
      <p className="muted">Use your university email address.</p>
      <RegisterForm />
      <p className="muted">
        Already registered? <Link href="/login">Sign in</Link>
      </p>
    </main>
  );
}
