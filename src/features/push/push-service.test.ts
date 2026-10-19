import webpush, { WebPushError } from 'web-push';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sendPush } from './push-service';

const subscription = {
  endpoint: 'https://push.example.com/1',
  keys: { p256dh: 'p', auth: 'a' },
};
const vapid = { publicKey: 'public', privateKey: 'private', subject: 'mailto:ops@example.com' };
const payload = { title: 'Title', body: 'Body' };

function pushError(statusCode: number) {
  return new WebPushError('push failed', statusCode, {}, '', subscription.endpoint);
}

describe('sendPush', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends the JSON payload with per-request VAPID details', async () => {
    const send = vi.spyOn(webpush, 'sendNotification').mockResolvedValue({
      statusCode: 201,
      body: '',
      headers: {},
    });

    await expect(sendPush(subscription, payload, vapid)).resolves.toBe('sent');
    expect(send).toHaveBeenCalledWith(
      subscription,
      JSON.stringify(payload),
      expect.objectContaining({ vapidDetails: vapid }),
    );
  });

  it.each([404, 410])('reports the subscription as expired on %i', async (status) => {
    vi.spyOn(webpush, 'sendNotification').mockRejectedValue(pushError(status));

    await expect(sendPush(subscription, payload, vapid)).resolves.toBe('expired');
  });

  it('rethrows other push service errors', async () => {
    vi.spyOn(webpush, 'sendNotification').mockRejectedValue(pushError(500));

    await expect(sendPush(subscription, payload, vapid)).rejects.toThrow('push failed');
  });
});
