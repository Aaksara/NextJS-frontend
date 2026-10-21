import { type Paginated, requestApi } from "@/lib/api/api-client";

import { CONVERSATION_PAGE_SIZE, MESSAGE_PAGE_SIZE } from "./constants";
import type { Conversation, Message } from "./types";

const CONVERSATIONS = "/api/conversations/";

export const chatService = {
	/** Most recently active first. */
	conversations: (page: number) =>
		requestApi<Paginated<Conversation>>(
			`${CONVERSATIONS}?page=${page}&page_size=${CONVERSATION_PAGE_SIZE}`,
		),

	conversation: (id: number) => requestApi<Conversation>(`${CONVERSATIONS}${id}/`),

	/** Newest first. */
	messages: (id: number, page: number) =>
		requestApi<Paginated<Message>>(
			`${CONVERSATIONS}${id}/messages/?page=${page}&page_size=${MESSAGE_PAGE_SIZE}`,
		),

	send: (id: number, body: string) =>
		requestApi<Message>(`${CONVERSATIONS}${id}/messages/`, { body: { body } }),

	/** Marks the other student's messages read. */
	markRead: (id: number) =>
		requestApi<{ marked_read: number }>(`${CONVERSATIONS}${id}/read/`, { method: "POST" }),

	unreadCount: async () => {
		const data = await requestApi<{ unread: number }>(`${CONVERSATIONS}unread/`);
		return data.unread;
	},

	/** The chat for an exchange, started if needed. Either side may open it. */
	openForExchange: (exchangeId: number) =>
		requestApi<Conversation>(`/api/exchanges/${exchangeId}/conversation/`, { method: "POST" }),
};
