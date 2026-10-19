import { z } from 'zod';

export const pushSubscriptionSchema = z.object({
  endpoint: z.url({ protocol: /^https$/ }),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;

export const endpointSchema = pushSubscriptionSchema.shape.endpoint;

export const notificationMessageSchema = z.string().trim().min(1).max(200);
