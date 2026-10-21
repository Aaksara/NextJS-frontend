import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/typography";
import { conversationPath } from "@/features/student/routes";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/utils";

import { otherSide } from "../conversation";
import type { Conversation } from "../types";

interface ConversationListProps {
	conversations: Conversation[];
	selectedId: number | null;
	studentId: number;
}

export default function ConversationList({
	conversations,
	selectedId,
	studentId,
}: ConversationListProps) {
	return (
		<ul className="divide-y">
			{conversations.map((conversation) => {
				const other = otherSide(conversation, studentId);
				const last = conversation.last_message;
				const selected = conversation.id === selectedId;
				const unread = conversation.unread_count > 0;
				return (
					<li key={conversation.id}>
						<Link
							href={conversationPath(conversation.id)}
							aria-current={selected ? "page" : undefined}
							className={cn(
								"flex gap-3 px-4 py-3 outline-none transition-colors focus-visible:bg-muted",
								selected ? "bg-primary-container/60" : "hover:bg-muted",
							)}
						>
							<Avatar name={other.full_name} size="md" />
							<div className="min-w-0 flex-1">
								<div className="flex items-baseline justify-between gap-2">
									<Text as="span" variant="label-lg" className="truncate">
										{other.full_name}
									</Text>
									{last && (
										<Text as="span" variant="body-sm" tone="muted" className="shrink-0">
											{formatRelativeTime(last.created_at)}
										</Text>
									)}
								</div>
								<Text variant="body-sm" tone="muted" className="truncate">
									{conversation.listing_detail.book.title}
								</Text>
								<div className="flex items-center justify-between gap-2">
									<Text
										variant="body-sm"
										className={cn("truncate", unread ? "font-semibold" : "text-muted-foreground")}
									>
										{last ? last.body : "No messages yet"}
									</Text>
									{unread && (
										<span className="min-w-5 shrink-0 rounded-full bg-primary px-1.5 text-center text-label-sm text-primary-foreground tabular-nums">
											<span className="sr-only">Unread messages: </span>
											{conversation.unread_count}
										</span>
									)}
								</div>
							</div>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
