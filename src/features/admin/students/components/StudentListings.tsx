"use client";

import { useState } from "react";

import EmptyState from "@/components/admin/EmptyState";
import QueryState from "@/components/admin/QueryState";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { formatDate, formatNumber } from "@/lib/utils/format";

import {
	conditionLabels,
	LISTING_PAGE_SIZE,
	listingStatusLabels,
	listingStatusTones,
} from "../constants";
import { listingPrice } from "../listing-price";
import { useStudentListings } from "../queries";
import type { ListingStatus, StudentListingQuery } from "../types";

const statuses = Object.entries(listingStatusLabels) as [ListingStatus, string][];

export default function StudentListings({ studentId }: { studentId: number }) {
	const [status, setStatus] = useState<StudentListingQuery["status"]>("");
	const [page, setPage] = useState(1);
	const query = useStudentListings(studentId, { status, page });
	const listings = query.data?.results ?? [];
	const total = query.data?.count ?? 0;

	return (
		<Card aria-labelledby="student-listings" className="gap-0 overflow-hidden py-0">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
				<Text as="h2" id="student-listings" variant="label-lg">
					Listings
				</Text>
				<Select
					aria-label="Status"
					className="w-44"
					value={status}
					onChange={(event) => {
						setStatus(event.target.value as StudentListingQuery["status"]);
						setPage(1);
					}}
				>
					<option value="">All statuses</option>
					{statuses.map(([value, label]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</Select>
			</div>

			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.isSuccess &&
				(listings.length === 0 ? (
					<EmptyState
						title={status ? "No listings with this status" : "No listings yet"}
						hint={
							status
								? "Try another status, or show all of them."
								: "Books this student lists will show here."
						}
					/>
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Book</TableHead>
									<TableHead>Condition</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Requests</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Listed</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{listings.map((listing) => (
									<TableRow key={listing.id}>
										<TableCell className="min-w-56">
											<Text as="span" variant="label-lg" className="block">
												{listing.title}
											</Text>
											<Text as="span" variant="body-sm" tone="muted" className="block">
												{[listing.authors, listing.course_code].filter(Boolean).join(" · ") || "—"}
											</Text>
										</TableCell>
										<TableCell className="whitespace-nowrap">
											{conditionLabels[listing.condition]}
										</TableCell>
										<TableCell className="whitespace-nowrap tabular-nums">
											{listingPrice(listing)}
										</TableCell>
										<TableCell className="tabular-nums">{listing.request_count}</TableCell>
										<TableCell>
											<Badge tone={listingStatusTones[listing.status]} size="sm" dot>
												{listingStatusLabels[listing.status]}
											</Badge>
										</TableCell>
										<TableCell className="whitespace-nowrap text-muted-foreground">
											{formatDate(listing.created_at)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Pagination
							page={page}
							pageCount={Math.max(1, Math.ceil(total / LISTING_PAGE_SIZE))}
							onPageChange={setPage}
							summary={`${formatNumber(total)} listings`}
							className="border-t"
						/>
					</>
				))}
		</Card>
	);
}
