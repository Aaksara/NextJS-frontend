"use client";

import { BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { formatNumber } from "@/lib/utils/format";

import { useAvailableListingCount, useCompletedExchangeCount, useExchangeCount } from "../queries";
import { useStudent } from "../session";
import ListBookButton from "./ListBookButton";

function Stat({ label, value, hint }: { label: string; value?: number; hint: ReactNode }) {
	return (
		<div className="rounded-lg bg-muted px-4 py-3">
			<Text as="dt" variant="label-sm" tone="muted" className="uppercase tracking-wider">
				{label}
			</Text>
			<Text as="dd" variant="headline-md" className="text-primary tabular-nums">
				{value === undefined ? "–" : formatNumber(value)}
			</Text>
			<Text as="dd" variant="body-sm" tone="muted">
				{hint}
			</Text>
		</div>
	);
}

/** Who is signed in, and how their exchanges stand. */
export default function ProfileSummary() {
	const student = useStudent();
	const available = useAvailableListingCount();
	const review = useExchangeCount("review");
	const meetups = useExchangeCount("meetups");
	const completed = useCompletedExchangeCount();
	const details = [student.department, student.student_id && `ID ${student.student_id}`];

	return (
		<Card className="gap-6 p-5 sm:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
				<Avatar name={student.full_name} size="lg" />
				<div className="min-w-0 flex-1 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<Text as="h1" variant="headline-md">
							{student.full_name}
						</Text>
						<Badge tone="success" size="sm">
							<BadgeCheck />
							Verified student
						</Badge>
					</div>
					<Text tone="muted" className="truncate">
						{[...details, student.email].filter(Boolean).join(" · ")}
					</Text>
				</div>
				<ListBookButton size="lg" className="sm:self-center" />
			</div>
			<dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Stat label="On the shelf" value={available.data} hint="Listings others can request" />
				<Stat label="To review" value={review.data} hint="Requests for your books" />
				<Stat label="Meetups" value={meetups.data} hint="Agreed handovers" />
				<Stat label="Completed" value={completed.data} hint="Books exchanged so far" />
			</dl>
		</Card>
	);
}
