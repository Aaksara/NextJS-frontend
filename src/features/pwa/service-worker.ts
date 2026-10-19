/**
 * The worker caches static assets, which fights with dev-mode HMR, so it only
 * runs in production builds. Use `pnpm build && pnpm start` to test PWA features.
 */
export const SERVICE_WORKER_ENABLED = process.env.NODE_ENV === 'production';

export const SERVICE_WORKER_URL = '/sw.js';

export function isServiceWorkerSupported(): boolean {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}
