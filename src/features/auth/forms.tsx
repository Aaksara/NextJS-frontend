'use client';

import Link from 'next/link';
import { type ReactNode, useActionState } from 'react';

import { login, register, requestPasswordReset, resetPassword } from './actions';
import type { FormState } from './types';

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

type FieldProps = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
  state: FormState;
};

function Field({ name, label, type = 'text', autoComplete, state }: FieldProps) {
  const errors = state.fieldErrors?.[name];
  const errorId = `${name}-error`;
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? errorId : undefined}
      />
      {errors && (
        <p id={errorId} className="error">
          {errors.join(' ')}
        </p>
      )}
    </>
  );
}

function AuthForm({
  action,
  submitLabel,
  children,
}: {
  action: Action;
  submitLabel: string;
  children: (state: FormState) => ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  if (state.message) return <p role="status">{state.message}</p>;

  return (
    <form className="stack" action={formAction}>
      {children(state)}
      {state.error && (
        <p role="alert" className="error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={isPending}>
        {submitLabel}
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <AuthForm action={login} submitLabel="Sign in">
      {(state) => (
        <>
          <Field
            name="email"
            label="University email"
            type="email"
            autoComplete="email"
            state={state}
          />
          <Field
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            state={state}
          />
          <p className="muted">
            <Link href="/forgot-password">Forgot your password?</Link>
          </p>
        </>
      )}
    </AuthForm>
  );
}

export function RegisterForm() {
  return (
    <AuthForm action={register} submitLabel="Create account">
      {(state) => (
        <>
          <Field name="full_name" label="Full name" autoComplete="name" state={state} />
          <Field
            name="email"
            label="University email"
            type="email"
            autoComplete="email"
            state={state}
          />
          <Field
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            state={state}
          />
        </>
      )}
    </AuthForm>
  );
}

export function ForgotPasswordForm() {
  return (
    <AuthForm action={requestPasswordReset} submitLabel="Send reset link">
      {(state) => (
        <Field
          name="email"
          label="University email"
          type="email"
          autoComplete="email"
          state={state}
        />
      )}
    </AuthForm>
  );
}

export function ResetPasswordForm({ uid, token }: { uid: string; token: string }) {
  return (
    <AuthForm action={resetPassword} submitLabel="Set new password">
      {(state) => (
        <>
          <input type="hidden" name="uid" value={uid} />
          <input type="hidden" name="token" value={token} />
          <Field
            name="new_password"
            label="New password"
            type="password"
            autoComplete="new-password"
            state={state}
          />
        </>
      )}
    </AuthForm>
  );
}
