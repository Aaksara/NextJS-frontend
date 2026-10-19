import Link from 'next/link';

import { Form } from '@/components/form';

export const metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <main className="container">
      <h1>Sign in</h1>
      <Form
        path="/api/auth/login/"
        submitLabel="Sign in"
        redirectTo="/"
        fields={[
          { name: 'email', label: 'University email', type: 'email', autoComplete: 'email' },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            autoComplete: 'current-password',
          },
        ]}
      />
      <p className="muted">
        <Link href="/forgot-password">Forgot your password?</Link> ·{' '}
        <Link href="/register">Create an account</Link>
      </p>
    </main>
  );
}
