"use client";

import { BookPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import EmptyState from "@/components/feedback/EmptyState";
import QueryState from "@/components/feedback/QueryState";
import PageHeader from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/filter-chips";
import { Pagination } from "@/components/ui/pagination";
import { Text } from "@/components/ui/typography";
import { listingStatusLabels, listingStatusTones } from "@/features/listings/labels";
import type { ListingStatus } from "@/features/listings/types";
import { usePageInRange } from "@/hooks/use-page-in-range";
import { formatCount, formatDate } from "@/lib/utils/format";

import { MY_LISTINGS_PAGE_SIZE } from "../constants";
import { useMyListings, useSetListingAvailable } from "../queries";
import { STUDENT_HOME } from "../routes";
import type { Listing } from "../types";
import ListBookButton from "./ListBookButton";
import ListingCard from "./ListingCard";
import ListingFormDialog from "./ListingFormDialog";

const statusFilters: { value: ListingStatus | ""; label: string }[] = [
	{ value: "", label: "All" },
	...(Object.entries(listingStatusLabels) as [ListingStatus, string][]).map(([value, label]) => ({
		value,
		label,
	})),
];

export default function MyListingsView() {
	const [status, setStatus] = useState<ListingStatus | "">("");
	const [page, setPage] = useState(1);
	const query = useMyListings({ status, page });
	usePageInRange(page, setPage, query.error);
	const listings = query.data?.results ?? [];
	const total = query.data?.count ?? 0;

	return (
		<>
			<PageHeader
				title="My listings"
				description="Everything you have put up for sale, swap or donation. Withdraw a book to hide it without losing its history."
				actions={<ListBookButton />}
			/>

			<FilterChips
				label="Status"
				options={statusFilters}
				value={status}
				onChange={(value) => {
					setStatus(value);
					setPage(1);
				}}
			/>

			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.isSuccess &&
				(listings.length === 0 ? (
					<EmptyState
						icon={BookPlus}
						title={
							status
								? `No ${listingStatusLabels[status].toLowerCase()} listings`
								: "No listings yet"
						}
						hint={
							status
								? "Try another status, or show all of them."
								: "List a book and classmates can request it straight away."
						}
					/>
				) : (
					<>
						<ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
							{listings.map((listing) => (
								<li key={listing.id}>
									<OwnListing listing={listing} />
								</li>
							))}
						</ul>
						<Pagination
							page={page}
							pageCount={Math.max(1, Math.ceil(total / MY_LISTINGS_PAGE_SIZE))}
							onPageChange={setPage}
							summary={formatCount(total, "listing")}
							className="px-0"
						/>
					</>
				))}
		</>
	);
}

function OwnListing({ listing }: { listing: Listing }) {
	const [editing, setEditing] = useState(false);
	const setAvailable = useSetListingAvailable();
	const title = listing.book.title;

	function confirmWithdraw() {
		const message = `Withdraw ${title}? It is hidden from other students, and requests waiting for it are declined.`;
		if (window.confirm(message)) setAvailable.mutate({ id: listing.id, available: false });
	}

	const edit = (
		<Button size="sm" variant="outlined" onClick={() => setEditing(true)}>
			Edit
		</Button>
	);
	const actions = {
		available: (
			<>
				{edit}
				<Button
					size="sm"
					variant="ghost"
					onClick={confirmWithdraw}
					disabled={setAvailable.isPending}
				>
					Withdraw
				</Button>
			</>
		),
		withdrawn: (
			<>
				{edit}
				<Button
					size="sm"
					onClick={() => setAvailable.mutate({ id: listing.id, available: true })}
					disabled={setAvailable.isPending}
				>
					Relist
				</Button>
			</>
		),
		// An accepted exchange holds the book; it is managed from the meetup.
		reserved: (
			<Button asChild size="sm" variant="secondary">
				<Link href={STUDENT_HOME}>View meetup</Link>
			</Button>
		),
		completed: (
			<Text as="span" variant="label-md" tone="muted" className="py-1.5 text-center">
				Exchanged {formatDate(listing.updated_at)}
			</Text>
		),
	};

	return (
		<>
			<ListingCard
				listing={listing}
				badge={
					<Badge tone={listingStatusTones[listing.status]} size="sm" dot>
						{listingStatusLabels[listing.status]}
					</Badge>
				}
				meta={`Listed ${formatDate(listing.created_at)}`}
				actions={actions[listing.status]}
			/>
			<ListingFormDialog listing={listing} open={editing} onClose={() => setEditing(false)} />
		</>
	);
}
