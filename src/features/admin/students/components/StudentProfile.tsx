"use client";

import { BadgeCheck, Ban, Mail, RotateCcw, Send } from "lucide-react";

import QueryState from "@/components/admin/QueryState";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils/format";

import { conditionLabels, listingStatusLabels, listingTypeLabels } from "../constants";
import {
	useReactivateStudent,
	useResendVerification,
	useStudent,
	useSuspendStudent,
	useVerifyStudentEmail,
} from "../queries";
import type { StudentDetail, StudentListing } from "../types";
import StudentStatus from "./StudentStatus";

function Detail({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between gap-4">
			<Text as="dt" variant="body-sm" tone="muted">
				{label}
			</Text>
			<Text as="dd" variant="label-md" className="text-right">
				{value || "—"}
			</Text>
		</div>
	);
}

function SectionTitle({ children }: { children: string }) {
	return (
		<Text as="h3" variant="label-sm" tone="muted" className="uppercase tracking-wider">
			{children}
		</Text>
	);
}

function listingPrice(listing: StudentListing) {
	return listing.price === null
		? listingTypeLabels[listing.listing_type]
		: formatCurrency(Number(listing.price));
}

/** Moderation actions, offered only where they apply to the student's state. */
function StudentActions({ student }: { student: StudentDetail }) {
	const suspend = useSuspendStudent();
	const reactivate = useReactivateStudent();
	const verify = useVerifyStudentEmail();
	const resend = useResendVerification();

	function confirmSuspend() {
		const message = `Suspend ${student.full_name}? They are signed out and cannot sign in until reactivated.`;
		if (window.confirm(message)) suspend.mutate(student.id);
	}

	return (
		<div className="space-y-2 border-t pt-5">
			<Button asChild className="w-full">
				<a href={`mailto:${student.email}`}>
					<Mail />
					Email student
				</a>
			</Button>
			{!student.is_email_verified && (
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outlined"
						onClick={() => resend.mutate(student.id)}
						disabled={resend.isPending}
					>
						<Send />
						Resend link
					</Button>
					<Button
						variant="outlined"
						onClick={() => verify.mutate(student.id)}
						disabled={verify.isPending}
					>
						<BadgeCheck />
						Mark verified
					</Button>
				</div>
			)}
			{student.is_active ? (
				<Button
					variant="ghost"
					className="w-full text-destructive hover:bg-destructive-container hover:text-destructive-container-foreground"
					onClick={confirmSuspend}
					disabled={suspend.isPending}
				>
					<Ban />
					Suspend account
				</Button>
			) : (
				<Button
					variant="outlined"
					className="w-full"
					onClick={() => reactivate.mutate(student.id)}
					disabled={reactivate.isPending}
				>
					<RotateCcw />
					Reactivate account
				</Button>
			)}
		</div>
	);
}

/** Full record for the selected student, with moderation actions. */
export default function StudentProfile({ studentId }: { studentId: number }) {
	const query = useStudent(studentId);
	const student = query.data;

	if (!student) {
		return (
			<Card className="p-5">
				<QueryState isPending={!query.isError} error={query.error} onRetry={query.refetch} />
			</Card>
		);
	}

	return (
		<Card aria-label={`${student.full_name} profile`} className="gap-6 p-5">
			<div className="flex items-start gap-4">
				<Avatar name={student.full_name} size="lg" />
				<div className="min-w-0 flex-1 space-y-1">
					<Text as="h2" variant="headline-sm" className="text-primary">
						{student.full_name}
					</Text>
					<Text variant="body-sm" tone="muted" className="truncate">
						{student.email}
					</Text>
					<StudentStatus student={student} />
				</div>
			</div>

			<section className="space-y-3">
				<SectionTitle>Account</SectionTitle>
				<dl className="space-y-2">
					<Detail label="Student ID" value={student.student_id} />
					<Detail label="Department" value={student.department} />
					<Detail label="Phone" value={student.phone} />
					<Detail label="Joined" value={formatDate(student.date_joined)} />
					<Detail
						label="Last sign-in"
						value={student.last_login ? formatRelativeTime(student.last_login) : "Never"}
					/>
					<Detail label="Exchange requests" value={String(student.request_count)} />
				</dl>
			</section>

			<section className="space-y-3">
				<SectionTitle>{`Recent listings (${student.listing_count} total)`}</SectionTitle>
				{student.recent_listings.length === 0 ? (
					<Text variant="body-sm" tone="muted">
						No listings yet.
					</Text>
				) : (
					<ul className="space-y-2">
						{student.recent_listings.map((listing) => (
							<li
								key={listing.id}
								className="flex items-center justify-between gap-3 rounded-lg bg-muted p-3"
							>
								<div className="min-w-0">
									<Text variant="label-md" className="truncate">
										{listing.title}
									</Text>
									<Text variant="body-sm" tone="muted">
										{[
											listing.course_code,
											conditionLabels[listing.condition],
											listingStatusLabels[listing.status],
										]
											.filter(Boolean)
											.join(" · ")}
									</Text>
								</div>
								<Text as="span" variant="label-lg" className="shrink-0 text-primary tabular-nums">
									{listingPrice(listing)}
								</Text>
							</li>
						))}
					</ul>
				)}
			</section>

			<StudentActions student={student} />
		</Card>
	);
}
