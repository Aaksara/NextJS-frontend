import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container">
      <h1>Page not found</h1>
      <p className="muted">
        <Link href="/">Back to home</Link>
      </p>
    </main>
  );
}
