"use client";

import { MessagesSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

import EmptyState from "@/components/feedback/EmptyState";
import QueryState from "@/components/feedback/QueryState";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStudent } from "@/features/student/session";
import { cn } from "@/lib/utils/utils";

import { useConversations } from "../queries";
import ConversationList from "./ConversationList";
import ConversationThread from "./ConversationThread";

/** The inbox beside the open conversation; on phones, one or the other. */
export default function MessagesView() {
	const student = useStudent();
	const conversations = useConversations();
	const selected = Number(useSearchParams().get("c")) || null;

	return (
		<>
			<PageHeader
				title="Messages"
				description="Talk to sellers and buyers, and agree where and when to hand books over on campus."
			/>
			<Card className="h-[calc(100dvh-16rem)] min-h-[28rem] flex-row gap-0 overflow-hidden py-0">
				<div
					className={cn(
						"w-full flex-col overflow-y-auto border-r lg:flex lg:w-80 lg:shrink-0",
						selected ? "hidden" : "flex",
					)}
				>
					<QueryState
						isPending={conversations.isPending}
						error={conversations.error}
						onRetry={conversations.refetch}
					/>
					{conversations.isSuccess &&
						(conversations.data.length === 0 ? (
							<EmptyState
								icon={MessagesSquare}
								title="No messages yet"
								hint="Open the chat from one of your exchanges to talk it through."
							/>
						) : (
							<>
								<ConversationList
									conversations={conversations.data}
									selectedId={selected}
									studentId={student.id}
								/>
								{conversations.hasNextPage && (
									<Button
										variant="ghost"
										size="sm"
										className="m-3"
										onClick={() => conversations.fetchNextPage()}
										disabled={conversations.isFetchingNextPage}
									>
										Show more
									</Button>
								)}
							</>
						))}
				</div>
				<div className={cn("min-w-0 flex-1", selected ? "block" : "hidden lg:block")}>
					{selected ? (
						<ConversationThread key={selected} id={selected} studentId={student.id} />
					) : (
						<EmptyState
							icon={MessagesSquare}
							title="Pick a conversation"
							hint="Choose a chat on the left to read and reply."
						/>
					)}
				</div>
			</Card>
		</>
	);
}
