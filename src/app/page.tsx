import Link from 'next/link';

import { logout } from '@/features/auth/actions';
import { getCurrentUser } from '@/features/auth/session';
import { InstallPrompt } from '@/features/install/install-prompt';
import { PushNotifications } from '@/features/push/push-notifications';
import { getVapidConfig } from '@/lib/env';
import { siteConfig } from '@/lib/site';

export default async function HomePage() {
  const user = await getCurrentUser();
  // VAPID keys are runtime config, so one image can be deployed to any environment.
  const vapid = getVapidConfig();

  return (
    <main className="container">
      <h1>{siteConfig.name}</h1>
      <p className="muted">{siteConfig.description}</p>
      {user ? (
        <form className="button-row" action={logout}>
          <p>Signed in as {user.full_name}.</p>
          <button type="submit" className="secondary">
            Sign out
          </button>
        </form>
      ) : (
        <p>
          <Link href="/login">Sign in</Link> or <Link href="/register">create an account</Link>.
        </p>
      )}
      <InstallPrompt />
      {user && vapid && <PushNotifications vapidPublicKey={vapid.publicKey} />}
    </main>
  );
}
