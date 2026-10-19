import { Form } from '@/components/form';

export const metadata = { title: 'Forgot password' };

export default function ForgotPasswordPage() {
  return (
    <main className="container">
      <h1>Forgot password</h1>
      <Form
        path="/api/auth/password/reset/"
        submitLabel="Send reset link"
        successMessage="If an account exists for that email, a reset link has been sent."
        fields={[
          { name: 'email', label: 'University email', type: 'email', autoComplete: 'email' },
        ]}
      />
    </main>
  );
}
