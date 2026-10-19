'use server';

import { getCurrentUser } from '@/features/auth/session';
import { getVapidConfig } from '@/lib/env';
import { siteConfig } from '@/lib/site';

import { sendPush } from './push-service';
import { endpointSchema, notificationMessageSchema, pushSubscriptionSchema } from './schema';
import { subscriptionStore } from './subscription-store';

export type ActionResult = { ok: true } | { ok: false; error: string };

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  error: 'Push notifications are not configured on this server.',
};

const SIGNED_OUT: ActionResult = { ok: false, error: 'Sign in to use notifications.' };

export async function subscribe(input: unknown): Promise<ActionResult> {
  if (!getVapidConfig()) return NOT_CONFIGURED;
  // Anyone could otherwise fill the store with junk subscriptions.
  if (!(await getCurrentUser())) return SIGNED_OUT;

  const parsed = pushSubscriptionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid push subscription.' };

  await subscriptionStore.save(parsed.data);
  return { ok: true };
}

export async function unsubscribe(endpoint: unknown): Promise<ActionResult> {
  const parsed = endpointSchema.safeParse(endpoint);
  if (!parsed.success) return { ok: false, error: 'Invalid push subscription.' };

  await subscriptionStore.remove(parsed.data);
  return { ok: true };
}

/**
 * Sends a notification only to the caller's own subscription. The endpoint is an
 * unguessable capability URL, so it doubles as proof of ownership.
 */
export async function sendTestNotification(
  endpoint: unknown,
  message: unknown,
): Promise<ActionResult> {
  const vapid = getVapidConfig();
  if (!vapid) return NOT_CONFIGURED;
  if (!(await getCurrentUser())) return SIGNED_OUT;

  const parsedEndpoint = endpointSchema.safeParse(endpoint);
  const parsedMessage = notificationMessageSchema.safeParse(message);
  if (!parsedEndpoint.success || !parsedMessage.success) {
    return { ok: false, error: 'Message must be between 1 and 200 characters.' };
  }

  const subscription = await subscriptionStore.get(parsedEndpoint.data);
  if (!subscription) return { ok: false, error: 'Subscription not found. Subscribe again.' };

  try {
    const result = await sendPush(
      subscription,
      { title: siteConfig.name, body: parsedMessage.data, url: '/' },
      vapid,
    );
    if (result === 'expired') {
      await subscriptionStore.remove(subscription.endpoint);
      return { ok: false, error: 'Subscription expired. Subscribe again.' };
    }
    return { ok: true };
  } catch (error) {
    console.error('Failed to send push notification', error);
    return { ok: false, error: 'Failed to send notification.' };
  }
}
