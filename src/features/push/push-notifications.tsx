'use client';

import { useEffect, useState, useSyncExternalStore, useTransition } from 'react';

import { SERVICE_WORKER_ENABLED, isServiceWorkerSupported } from '@/features/pwa/service-worker';

import { type ActionResult, sendTestNotification, subscribe, unsubscribe } from './actions';
import { urlBase64ToUint8Array } from './url-base64';

type Props = {
  vapidPublicKey: string;
};

const noopSubscribe = () => () => {};

function isPushSupported(): boolean {
  return isServiceWorkerSupported() && 'PushManager' in window && 'Notification' in window;
}

function getStatusMessage(
  isSupported: boolean | null,
  subscription: PushSubscription | null | undefined,
): string | null {
  if (isSupported === null) return 'Loading…';
  if (!isSupported) return 'Push notifications are not supported in this browser.';
  if (!SERVICE_WORKER_ENABLED) {
    return 'The service worker is disabled in development. Run a production build to test push.';
  }
  if (subscription === undefined) return 'Loading…';
  return null;
}

export function PushNotifications({ vapidPublicKey }: Props) {
  // `null` until hydrated: support can only be detected in the browser.
  const isSupported = useSyncExternalStore<boolean | null>(
    noopSubscribe,
    isPushSupported,
    () => null,
  );
  // `undefined` while the existing subscription is being looked up.
  const [subscription, setSubscription] = useState<PushSubscription | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isSupported || !SERVICE_WORKER_ENABLED) return;

    let cancelled = false;
    void navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((existing) => {
        if (!cancelled) setSubscription(existing);
      });
    return () => {
      cancelled = true;
    };
  }, [isSupported]);

  function run(task: () => Promise<ActionResult | void>) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await task();
        if (result && !result.ok) setError(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    });
  }

  const handleSubscribe = () =>
    run(async () => {
      const registration = await navigator.serviceWorker.ready;
      const created = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      const result = await subscribe(created.toJSON());
      if (!result.ok) {
        await created.unsubscribe();
        return result;
      }
      setSubscription(created);
    });

  const handleUnsubscribe = () =>
    run(async () => {
      if (!subscription) return;
      const { endpoint } = subscription;
      await subscription.unsubscribe();
      setSubscription(null);
      return unsubscribe(endpoint);
    });

  const handleSendTest = () =>
    run(async () => {
      if (!subscription) return;
      const result = await sendTestNotification(subscription.endpoint, message);
      if (result.ok) setMessage('');
      return result;
    });

  const statusMessage = getStatusMessage(isSupported, subscription);

  return (
    <section className="panel" aria-labelledby="push-heading">
      <h2 id="push-heading">Push notifications</h2>
      {statusMessage ? (
        <p className="muted">{statusMessage}</p>
      ) : subscription ? (
        <>
          <p>You are subscribed.</p>
          <form
            className="stack"
            onSubmit={(event) => {
              event.preventDefault();
              handleSendTest();
            }}
          >
            <label htmlFor="push-message">Message</label>
            <input
              id="push-message"
              type="text"
              maxLength={200}
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div className="button-row">
              <button type="submit" disabled={isPending}>
                Send test
              </button>
              <button
                type="button"
                className="secondary"
                disabled={isPending}
                onClick={handleUnsubscribe}
              >
                Unsubscribe
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <p>You are not subscribed.</p>
          <button type="button" disabled={isPending} onClick={handleSubscribe}>
            Subscribe
          </button>
        </>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </section>
  );
}
