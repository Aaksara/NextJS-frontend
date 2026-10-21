"use client";

import {
	Ban,
	BookPlus,
	CircleCheck,
	CircleX,
	Handshake,
	type LucideIcon,
	MessageSquare,
	Send,
	UserPlus,
} from "lucide-react";
import { useState } from "react";

import QueryState from "@/components/admin/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { formatDateTime, formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/utils";

import { describeActivity } from "../activity";
import { ACTIVITY_PAGE_SIZE, MAX_ACTIVITY } from "../constants";
import { useStudentActivity } from "../queries";
import type { ActivityEvent } from "../types";

const tones = {
	primary: "bg-primary-container text-primary-container-foreground",
	secondary: "bg-secondary-container text-secondary-container-foreground",
	tertiary: "bg-tertiary-container text-tertiary-container-foreground",
	success: "bg-success-container text-success-container-foreground",
	neutral: "bg-muted text-muted-foreground",
};

const markers: Record<ActivityEvent["kind"], { icon: LucideIcon; tone: keyof typeof tones }> = {
	joined: { icon: UserPlus, tone: "primary" },
	listed: { icon: BookPlus, tone: "primary" },
	requested: { icon: Send, tone: "secondary" },
	accepted: { icon: CircleCheck, tone: "success" },
	rejected: { icon: CircleX, tone: "neutral" },
	cancelled: { icon: Ban, tone: "neutral" },
	completed: { icon: Handshake, tone: "success" },
	messaged: { icon: MessageSquare, tone: "tertiary" },
};

function ActivityItem({ event }: { event: ActivityEvent }) {
	const { icon: Icon, tone } = markers[event.kind];
	return (
		<li className="relative pl-6">
			<span
				aria-hidden
				className={cn(
					"absolute top-0 -left-4 flex size-8 items-center justify-center rounded-full ring-4 ring-card [&_svg]:size-4",
					tones[tone],
				)}
			>
				<Icon />
			</span>
			<Text className="pt-1">{describeActivity(event)}</Text>
			<Text variant="body-sm" tone="muted">
				<time dateTime={event.at} title={formatDateTime(event.at)}>
					{formatRelativeTime(event.at)}
				</time>
			</Text>
		</li>
	);
}

export default function StudentActivity({ studentId }: { studentId: number }) {
	const [limit, setLimit] = useState(ACTIVITY_PAGE_SIZE);
	const query = useStudentActivity(studentId, limit);
	const hasMore = query.data?.has_more ?? false;
	const atCap = limit >= MAX_ACTIVITY;

	return (
		<Card aria-labelledby="student-activity" className="gap-5 p-5">
			<div className="space-y-1">
				<Text as="h2" id="student-activity" variant="label-lg">
					Activity
				</Text>
				<Text variant="body-sm" tone="muted">
					Listings, exchange requests and conversations. Message contents stay private.
				</Text>
			</div>

			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.data && (
				<ol className="ml-4 space-y-5 border-l">
					{query.data.results.map((event) => (
						<ActivityItem key={event.id} event={event} />
					))}
				</ol>
			)}

			{hasMore &&
				(atCap ? (
					<Text variant="body-sm" tone="muted">
						Showing the newest {MAX_ACTIVITY} events.
					</Text>
				) : (
					<Button
						variant="outlined"
						className="self-start"
						onClick={() => setLimit((current) => current + ACTIVITY_PAGE_SIZE)}
						disabled={query.isFetching}
					>
						{query.isFetching ? "Loading…" : "Show older"}
					</Button>
				))}
		</Card>
	);
}
