'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

import { ApiError, api } from '@/lib/api';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
};

type Props = {
  /** API endpoint the form is posted to. */
  path: string;
  fields: Field[];
  submitLabel: string;
  /** Values sent along with the fields, e.g. the token from an email link. */
  extra?: Record<string, string>;
  /** Shown instead of the form once it succeeds... */
  successMessage?: string;
  /** ...or go to this page instead. */
  redirectTo?: string;
};

export function Form({ path, fields, submitLabel, extra, successMessage, redirectTo }: Props) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setSending(true);
    setError(null);
    try {
      await api(path, { ...values, ...extra });
      if (redirectTo) router.push(redirectTo);
      else setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError('Could not reach the server.'));
      setSending(false);
    }
  }

  if (done) return <p role="status">{successMessage}</p>;

  return (
    <form className="stack" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="stack">
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type ?? 'text'}
            autoComplete={field.autoComplete}
            required
          />
          {error?.fields[field.name] && (
            <p className="error">{error.fields[field.name]?.join(' ')}</p>
          )}
        </div>
      ))}
      {error?.message && (
        <p role="alert" className="error">
          {error.message}
        </p>
      )}
      <button type="submit" disabled={sending}>
        {submitLabel}
      </button>
    </form>
  );
}
