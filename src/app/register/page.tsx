import Link from 'next/link';

import { Form } from '@/components/form';

export const metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <main className="container">
      <h1>Create account</h1>
      <Form
        path="/api/auth/register/"
        submitLabel="Create account"
        successMessage="Account created. Check your university email for a verification link."
        fields={[
          { name: 'full_name', label: 'Full name', autoComplete: 'name' },
          { name: 'email', label: 'University email', type: 'email', autoComplete: 'email' },
          { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
        ]}
      />
      <p className="muted">
        Already registered? <Link href="/login">Sign in</Link>
      </p>
    </main>
  );
}
