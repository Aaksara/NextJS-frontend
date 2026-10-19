import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api';

import { toFormState } from './form-errors';

describe('toFormState', () => {
  it('uses detail as the form error', () => {
    const error = new ApiError(401, { detail: 'Please verify your email.', code: 'x' });
    expect(toFormState(error)).toEqual({ error: 'Please verify your email.', fieldErrors: {} });
  });

  it('maps field errors and non_field_errors', () => {
    const error = new ApiError(400, {
      email: ['Use your university email.'],
      non_field_errors: ['Invalid or expired link.'],
    });
    expect(toFormState(error)).toEqual({
      error: 'Invalid or expired link.',
      fieldErrors: { email: ['Use your university email.'] },
    });
  });

  it('falls back to a generic message for unexpected bodies', () => {
    expect(toFormState(new ApiError(500, {})).error).toBe('Something went wrong.');
  });

  it('reports network failures without leaking details', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(toFormState(new TypeError('fetch failed')).error).toMatch(/Could not reach/);
  });
});
