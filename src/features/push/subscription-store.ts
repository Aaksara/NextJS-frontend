import 'server-only';

import type { PushSubscriptionInput } from './schema';

/**
 * Persistence boundary for push subscriptions. Swap the in-memory implementation
 * for a database or Redis backed one before running more than one instance.
 */
export interface SubscriptionStore {
  save(subscription: PushSubscriptionInput): Promise<void>;
  get(endpoint: string): Promise<PushSubscriptionInput | undefined>;
  remove(endpoint: string): Promise<void>;
}

export function createMemorySubscriptionStore(): SubscriptionStore {
  const subscriptions = new Map<string, PushSubscriptionInput>();

  return {
    async save(subscription) {
      subscriptions.set(subscription.endpoint, subscription);
    },
    async get(endpoint) {
      return subscriptions.get(endpoint);
    },
    async remove(endpoint) {
      subscriptions.delete(endpoint);
    },
  };
}

// Reuse a single instance across dev hot reloads.
const globalForStore = globalThis as typeof globalThis & {
  __pushSubscriptionStore?: SubscriptionStore;
};

export const subscriptionStore = (globalForStore.__pushSubscriptionStore ??=
  createMemorySubscriptionStore());
