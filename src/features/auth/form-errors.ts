import { ApiError } from '@/lib/api';

import type { FormState } from './types';

/** Turns a failed API call into something a form can show. */
export function toFormState(error: unknown): FormState {
  if (!(error instanceof ApiError)) {
    console.error('Backend request failed', error);
    return { error: 'Could not reach the server. Please try again.' };
  }

  const fieldErrors: Record<string, string[]> = {};
  let detail = typeof error.body.detail === 'string' ? error.body.detail : undefined;
  for (const [field, value] of Object.entries(error.body)) {
    if (!Array.isArray(value)) continue;
    const messages = value.map(String);
    if (field === 'non_field_errors') detail = messages.join(' ');
    else fieldErrors[field] = messages;
  }

  if (!detail && Object.keys(fieldErrors).length === 0) detail = 'Something went wrong.';
  return { error: detail, fieldErrors };
}
