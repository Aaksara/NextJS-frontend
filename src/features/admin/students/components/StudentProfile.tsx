"use client";

import { ArrowRight } from "lucide-react";

import QueryState from "@/components/admin/QueryState";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/text-link";
import { Text } from "@/components/ui/typography";

import { conditionLabels, listingStatusLabels } from "../constants";
import { listingPrice } from "../listing-price";
import { useStudent } from "../queries";
import { studentPath } from "../routes";
import { ProfileSection, StudentAccountDetails, StudentIdentity } from "./StudentAccount";
import StudentActions from "./StudentActions";

/** A quick look at the selected student beside the directory, with moderation actions. */
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
			<StudentIdentity student={student} />

			<StudentAccountDetails student={student} />

			<ProfileSection title={`Recent listings (${student.listing_count} total)`}>
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
				<TextLink href={studentPath(student.id)}>
					All listings and activity
					<ArrowRight />
				</TextLink>
			</ProfileSection>

			<StudentActions student={student} />
		</Card>
	);
}
