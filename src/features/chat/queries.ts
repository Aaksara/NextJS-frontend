import {
	type InfiniteData,
	skipToken,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { conversationPath } from "@/features/student/routes";
import type { Paginated } from "@/lib/api/api-client";
import { getErrorMessage } from "@/lib/utils/page-helpers";

import { INBOX_POLL_MS, THREAD_POLL_MS } from "./constants";
import { chatService } from "./service";
import type { Conversation, Message } from "./types";

const all = ["chat"] as const;

/** Everything is under `all`, so one invalidation refreshes the inbox, threads and badge. */
const chatKeys = {
	all,
	conversations: [...all, "conversations"] as const,
	conversation: (id: number | null) => [...all, "conversation", id] as const,
	messages: (id: number | null) => [...all, "messages", id] as const,
	unread: [...all, "unread"] as const,
};

/** The page after the last one loaded, if the API has one. */
function nextPage<T>(last: Paginated<T>, pages: Paginated<T>[]) {
	return last.next ? pages.length + 1 : undefined;
}

function flatten<T>(data: InfiniteData<Paginated<T>>) {
	return data.pages.flatMap((page) => page.results);
}

/** The student's conversations, most recently active first, kept fresh by polling. */
export function useConversations() {
	return useInfiniteQuery({
		queryKey: chatKeys.conversations,
		queryFn: ({ pageParam }) => chatService.conversations(pageParam),
		initialPageParam: 1,
		getNextPageParam: nextPage<Conversation>,
		select: flatten<Conversation>,
		refetchInterval: INBOX_POLL_MS,
	});
}

export function useConversation(id: number | null) {
	return useQuery({
		queryKey: chatKeys.conversation(id),
		queryFn: id === null ? skipToken : () => chatService.conversation(id),
	});
}

/** A conversation's messages, newest first; further pages are older. */
export function useMessages(id: number | null) {
	return useInfiniteQuery({
		queryKey: chatKeys.messages(id),
		queryFn: id === null ? skipToken : ({ pageParam }) => chatService.messages(id, pageParam),
		initialPageParam: 1,
		getNextPageParam: nextPage<Message>,
		select: flatten<Message>,
		refetchInterval: THREAD_POLL_MS,
	});
}

/** For the badge on the Messages link. */
export function useUnreadCount() {
	return useQuery({
		queryKey: chatKeys.unread,
		queryFn: chatService.unreadCount,
		refetchInterval: INBOX_POLL_MS,
	});
}

export function useSendMessage(id: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: string) => chatService.send(id, body),
		onError: (error) => toast.error(getErrorMessage(error)),
		onSettled: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: chatKeys.messages(id) }),
				queryClient.invalidateQueries({ queryKey: chatKeys.conversations }),
			]),
	});
}

export function useMarkRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: chatService.markRead,
		onSettled: () => queryClient.invalidateQueries({ queryKey: chatKeys.all }),
	});
}

/** Opens an exchange's chat, starting it if needed, on the messages page. */
export function useOpenExchangeChat() {
	const router = useRouter();
	return useMutation({
		mutationFn: chatService.openForExchange,
		onSuccess: (conversation) => router.push(conversationPath(conversation.id)),
		onError: (error) => toast.error(getErrorMessage(error)),
	});
}
