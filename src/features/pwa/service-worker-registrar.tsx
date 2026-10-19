'use client';

import { useEffect } from 'react';

import {
  SERVICE_WORKER_ENABLED,
  SERVICE_WORKER_URL,
  isServiceWorkerSupported,
} from './service-worker';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!isServiceWorkerSupported()) return;

    if (!SERVICE_WORKER_ENABLED) {
      // A worker left over from a local production run would otherwise serve stale assets.
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => Promise.all(registrations.map((r) => r.unregister())));
      return;
    }

    navigator.serviceWorker
      .register(SERVICE_WORKER_URL, { scope: '/', updateViaCache: 'none' })
      .catch((error: unknown) => console.error('Service worker registration failed', error));
  }, []);

  return null;
}
