import { describe, expect, it } from 'vitest';

import { createMemorySubscriptionStore } from './subscription-store';

const subscription = {
  endpoint: 'https://push.example.com/1',
  keys: { p256dh: 'p', auth: 'a' },
};

describe('createMemorySubscriptionStore', () => {
  it('saves, reads and removes subscriptions by endpoint', async () => {
    const store = createMemorySubscriptionStore();

    await store.save(subscription);
    expect(await store.get(subscription.endpoint)).toEqual(subscription);

    await store.remove(subscription.endpoint);
    expect(await store.get(subscription.endpoint)).toBeUndefined();
  });

  it('keeps subscriptions isolated per endpoint', async () => {
    const store = createMemorySubscriptionStore();
    const other = { ...subscription, endpoint: 'https://push.example.com/2' };

    await store.save(subscription);
    await store.save(other);
    await store.remove(subscription.endpoint);

    expect(await store.get(other.endpoint)).toEqual(other);
  });
});
