/** Paging. Messages come newest first, so each further page is older. */
export const CONVERSATION_PAGE_SIZE = 20;
export const MESSAGE_PAGE_SIZE = 30;

/** The API has no push, so the app polls. Faster while a conversation is open. */
export const THREAD_POLL_MS = 5_000;
export const INBOX_POLL_MS = 20_000;

/** `MAX_MESSAGE_LENGTH` in `chat/models.py`. */
export const MAX_MESSAGE_LENGTH = 2000;
