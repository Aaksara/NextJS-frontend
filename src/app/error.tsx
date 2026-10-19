'use client';

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container">
      <h1>Something went wrong</h1>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
