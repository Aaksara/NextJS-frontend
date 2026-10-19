import { describe, expect, it } from 'vitest';

import { parseServerEnv } from './env';

const vapid = {
  VAPID_PUBLIC_KEY: 'public',
  VAPID_PRIVATE_KEY: 'private',
  VAPID_SUBJECT: 'mailto:ops@example.com',
};

const defaults = { API_URL: 'http://localhost:8000' };

describe('parseServerEnv', () => {
  it('accepts an environment without push configured', () => {
    expect(parseServerEnv({})).toEqual(defaults);
  });

  it('treats empty strings as unset', () => {
    expect(parseServerEnv({ VAPID_PUBLIC_KEY: '', VAPID_PRIVATE_KEY: ' ' })).toEqual(defaults);
  });

  it('accepts a complete VAPID configuration', () => {
    expect(parseServerEnv(vapid)).toEqual({ ...defaults, ...vapid });
  });

  it('rejects an invalid API URL', () => {
    expect(() => parseServerEnv({ API_URL: 'localhost' })).toThrow(/API_URL/);
  });

  it('rejects a partial VAPID configuration', () => {
    expect(() => parseServerEnv({ VAPID_PUBLIC_KEY: 'public' })).toThrow(/must be set together/);
  });

  it('rejects an invalid VAPID subject', () => {
    expect(() => parseServerEnv({ ...vapid, VAPID_SUBJECT: 'ops@example.com' })).toThrow(
      /VAPID_SUBJECT/,
    );
  });
});
