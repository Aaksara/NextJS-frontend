import type { Metadata } from 'next';

import { ForgotPasswordForm } from '@/features/auth/forms';

export const metadata: Metadata = { title: 'Forgot password' };

export default function ForgotPasswordPage() {
  return (
    <main className="container">
      <h1>Forgot password</h1>
      <ForgotPasswordForm />
    </main>
  );
}
