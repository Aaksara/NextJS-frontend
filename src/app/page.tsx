'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { api } from '@/lib/api';

type User = { full_name: string };

export default function HomePage() {
  // `undefined` while loading, `null` when signed out.
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    api<User>('/api/auth/me/').then(setUser, () => setUser(null));
  }, []);

  async function signOut() {
    await api('/api/auth/logout/', {});
    setUser(null);
  }

  return (
    <main className="container">
      <h1>BookX</h1>
      <p className="muted">Buy, swap and donate textbooks on campus.</p>
      {user === null && (
        <p>
          <Link href="/login">Sign in</Link> or <Link href="/register">create an account</Link>.
        </p>
      )}
      {user && (
        <div className="button-row">
          <p>Signed in as {user.full_name}.</p>
          <button type="button" className="secondary" onClick={signOut}>
            Sign out
          </button>
        </div>
      )}
    </main>
  );
}
