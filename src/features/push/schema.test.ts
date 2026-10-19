import { describe, expect, it } from 'vitest';

import { notificationMessageSchema, pushSubscriptionSchema } from './schema';

const subscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
  expirationTime: null,
  keys: { p256dh: 'p256dh-key', auth: 'auth-secret' },
};

describe('pushSubscriptionSchema', () => {
  it('accepts a browser PushSubscription JSON', () => {
    expect(pushSubscriptionSchema.parse(subscription)).toEqual(subscription);
  });

  it('rejects non-https endpoints', () => {
    const result = pushSubscriptionSchema.safeParse({
      ...subscription,
      endpoint: 'http://example.com/push',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing keys', () => {
    const result = pushSubscriptionSchema.safeParse({ ...subscription, keys: { auth: 'x' } });
    expect(result.success).toBe(false);
  });
});

describe('notificationMessageSchema', () => {
  it('trims the message', () => {
    expect(notificationMessageSchema.parse('  hi  ')).toBe('hi');
  });

  it.each(['', '   ', 'x'.repeat(201)])('rejects %j', (message) => {
    expect(notificationMessageSchema.safeParse(message).success).toBe(false);
  });
});
