import 'server-only';

import { z } from 'zod';

const optionalString = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

const envSchema = z
  .object({
    API_URL: z.url().default('http://localhost:8000'),
    VAPID_PUBLIC_KEY: optionalString,
    VAPID_PRIVATE_KEY: optionalString,
    VAPID_SUBJECT: optionalString.pipe(
      z
        .string()
        .regex(/^(mailto:|https:\/\/)/, 'must start with "mailto:" or "https://"')
        .optional(),
    ),
  })
  .superRefine((env, ctx) => {
    const vapidValues = [env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY, env.VAPID_SUBJECT];
    const configured = vapidValues.filter(Boolean).length;
    // Push is optional, but a half-configured setup is always a mistake.
    if (configured > 0 && configured < vapidValues.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT must be set together',
      });
    }
  });

export type ServerEnv = z.infer<typeof envSchema>;

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

let cached: ServerEnv | undefined;

/** Parsed lazily so `next build` does not require runtime secrets. */
export function getServerEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}

export type VapidConfig = { publicKey: string; privateKey: string; subject: string };

export function getVapidConfig(): VapidConfig | null {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = getServerEnv();
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
    return null;
  }
  return { publicKey: VAPID_PUBLIC_KEY, privateKey: VAPID_PRIVATE_KEY, subject: VAPID_SUBJECT };
}
