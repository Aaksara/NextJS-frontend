import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Offline' };

export default function OfflinePage() {
  return (
    <main className="container">
      <h1>You are offline</h1>
      <p className="muted">Check your connection and try again.</p>
    </main>
  );
}
