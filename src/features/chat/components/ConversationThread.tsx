"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import QueryState from "@/components/feedback/QueryState";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/typography";
import { listingStatusLabels, listingStatusTones } from "@/features/listings/labels";
import { STUDENT_MESSAGES } from "@/features/student/routes";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/utils";

import { otherSide } from "../conversation";
import { useConversation, useMarkRead, useMessages } from "../queries";
import MessageComposer from "./MessageComposer";

interface ConversationThreadProps {
	id: number;
	studentId: number;
}

export default function ConversationThread({ id, studentId }: ConversationThreadProps) {
	const conversation = useConversation(id);
	const messages = useMessages(id);
	const { mutate: markRead } = useMarkRead();
	const scroller = useRef<HTMLDivElement>(null);
	// Oldest first for reading; the API pages newest first.
	const ordered = [...(messages.data ?? [])].reverse();
	const newest = ordered.at(-1);
	const hasUnread = ordered.some((message) => message.sender !== studentId && !message.read_at);

	useEffect(() => {
		if (hasUnread) markRead(id);
	}, [hasUnread, id, markRead]);

	// Follow new messages, but not older ones loaded above.
	const newestId = newest?.id;
	useEffect(() => {
		const element = scroller.current;
		if (newestId !== undefined && element) element.scrollTop = element.scrollHeight;
	}, [newestId]);

	if (!conversation.data) {
		return (
			<QueryState
				isPending={conversation.isPending}
				error={conversation.error}
				onRetry={conversation.refetch}
			/>
		);
	}

	const other = otherSide(conversation.data, studentId);
	const listing = conversation.data.listing_detail;
	// Shown under the student's latest message once the other side has read it.
	const lastOwn = ordered.findLast((message) => message.sender === studentId);

	return (
		<section aria-label={`Conversation with ${other.full_name}`} className="flex h-full flex-col">
			<header className="flex items-center gap-3 border-b px-4 py-3">
				<IconButton
					asChild
					variant="ghost"
					size="icon-sm"
					label="All messages"
					className="lg:hidden"
				>
					<Link href={STUDENT_MESSAGES}>
						<ArrowLeft />
					</Link>
				</IconButton>
				<Avatar name={other.full_name} size="md" />
				<div className="min-w-0 flex-1">
					<Text variant="label-lg" className="truncate">
						{other.full_name}
					</Text>
					<Text variant="body-sm" tone="muted" className="truncate">
						{listing.book.title}
					</Text>
				</div>
				<Badge tone={listingStatusTones[listing.status]} size="sm" dot>
					{listingStatusLabels[listing.status]}
				</Badge>
			</header>

			<div ref={scroller} className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
				{messages.hasNextPage && (
					<div className="flex justify-center pb-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => messages.fetchNextPage()}
							disabled={messages.isFetchingNextPage}
						>
							{messages.isFetchingNextPage ? "Loading…" : "Show older messages"}
						</Button>
					</div>
				)}
				<QueryState
					isPending={messages.isPending}
					error={messages.error}
					onRetry={messages.refetch}
				/>
				{messages.isSuccess && ordered.length === 0 && (
					<Text tone="muted" className="py-10 text-center">
						Say hello, and agree where and when to hand the book over on campus.
					</Text>
				)}
				{ordered.map((message) => {
					const mine = message.sender === studentId;
					return (
						<div
							key={message.id}
							className={cn("flex flex-col", mine ? "items-end" : "items-start")}
						>
							<Text
								className={cn(
									"max-w-[80%] whitespace-pre-line break-words rounded-2xl px-3.5 py-2",
									mine
										? "rounded-br-sm bg-primary text-primary-foreground"
										: "rounded-bl-sm bg-muted text-foreground",
								)}
							>
								{message.body}
							</Text>
							<Text as="span" variant="body-sm" tone="muted" className="px-1 pt-0.5">
								{formatRelativeTime(message.created_at)}
								{message === lastOwn && message.read_at && " · Seen"}
							</Text>
						</div>
					);
				})}
			</div>

			<MessageComposer conversationId={id} />
		</section>
	);
}
