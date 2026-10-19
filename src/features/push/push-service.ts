import 'server-only';

import webpush, { WebPushError } from 'web-push';

import type { VapidConfig } from '@/lib/env';

import type { PushSubscriptionInput } from './schema';

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export type SendResult = 'sent' | 'expired';

const GONE_STATUS_CODES = new Set([404, 410]);

export async function sendPush(
  subscription: PushSubscriptionInput,
  payload: PushPayload,
  vapid: VapidConfig,
): Promise<SendResult> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload), {
      vapidDetails: vapid,
      TTL: 60 * 60,
    });
    return 'sent';
  } catch (error) {
    // The push service no longer knows this subscription; callers should drop it.
    if (error instanceof WebPushError && GONE_STATUS_CODES.has(error.statusCode)) {
      return 'expired';
    }
    throw error;
  }
}
