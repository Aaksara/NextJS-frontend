"use client";

import Link from "next/link";
import { useState } from "react";

import EmptyState from "@/components/feedback/EmptyState";
import QueryState from "@/components/feedback/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/filter-chips";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Text } from "@/components/ui/typography";
import { listingTypeFilters } from "@/features/listings/labels";
import type { ListingType } from "@/features/listings/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { usePageInRange } from "@/hooks/use-page-in-range";
import { formatCount } from "@/lib/utils/format";

import { BROWSE_PAGE_SIZE } from "../constants";
import { useBrowseListings } from "../queries";
import { STUDENT_LISTINGS } from "../routes";
import type { ViewerListing } from "../types";
import ListingCard from "./ListingCard";
import RequestDialog from "./RequestDialog";

/** Every available book on campus, to search and request. */
export default function CampusListings() {
	const [search, setSearch] = useState("");
	const [listingType, setListingType] = useState<ListingType | "">("");
	const [page, setPage] = useState(1);
	const query = useBrowseListings({
		search: useDebouncedValue(search.trim()),
		listing_type: listingType,
		page,
	});
	usePageInRange(page, setPage, query.error);
	const listings = query.data?.results ?? [];
	const total = query.data?.count ?? 0;
	const filtered = search.trim() !== "" || listingType !== "";

	return (
		<section aria-labelledby="campus-title" className="space-y-4">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div className="space-y-1">
					<Text as="h2" id="campus-title" variant="headline-md">
						Available on campus
					</Text>
					<Text tone="muted">
						Books students are selling, swapping or giving away. Yours are marked.
					</Text>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<FilterChips
						label="Listing type"
						options={listingTypeFilters}
						value={listingType}
						onChange={(value) => {
							setListingType(value);
							setPage(1);
						}}
					/>
					<SearchInput
						placeholder="Search title, author or course"
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(1);
						}}
						className="sm:w-72"
					/>
				</div>
			</div>

			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.isSuccess &&
				(listings.length === 0 ? (
					<EmptyState
						title={filtered ? "No books match" : "No books listed yet"}
						hint={
							filtered
								? "Try another search or listing type."
								: "Books other students list will show here."
						}
					/>
				) : (
					<>
						<ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
							{listings.map((listing) => (
								<li key={listing.id}>
									<CampusListing listing={listing} />
								</li>
							))}
						</ul>
						<Pagination
							page={page}
							pageCount={Math.max(1, Math.ceil(total / BROWSE_PAGE_SIZE))}
							onPageChange={setPage}
							summary={formatCount(total, "book")}
							className="px-0"
						/>
					</>
				))}
		</section>
	);
}

function CampusListing({ listing }: { listing: ViewerListing }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<ListingCard
				listing={listing}
				badge={
					listing.is_owner && (
						<Badge tone="secondary" size="sm">
							Yours
						</Badge>
					)
				}
				meta={listing.seller.full_name}
				actions={<CampusListingAction listing={listing} onRequest={() => setOpen(true)} />}
			/>
			{!listing.is_owner && (
				<RequestDialog listing={listing} open={open} onClose={() => setOpen(false)} />
			)}
		</>
	);
}

function CampusListingAction({
	listing,
	onRequest,
}: {
	listing: ViewerListing;
	onRequest: () => void;
}) {
	if (listing.is_owner) {
		return (
			<Button asChild size="sm" variant="secondary">
				<Link href={STUDENT_LISTINGS}>Manage</Link>
			</Button>
		);
	}
	if (listing.has_active_request) {
		return (
			<Button size="sm" variant="secondary" disabled>
				Requested
			</Button>
		);
	}
	return (
		<Button size="sm" onClick={onRequest}>
			Request
		</Button>
	);
}
