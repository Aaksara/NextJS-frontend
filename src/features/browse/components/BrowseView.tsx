"use client";

import Link from "next/link";
import { useCallback } from "react";

import EmptyState from "@/components/feedback/EmptyState";
import QueryState from "@/components/feedback/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/filter-chips";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { listingTypeFilters } from "@/features/listings/labels";
import ListingCard from "@/features/student/components/ListingCard";
import { usePageInRange } from "@/hooks/use-page-in-range";
import { formatCount } from "@/lib/utils/format";

import { BROWSE_PAGE_SIZE } from "../constants";
import { useBrowsePage } from "../queries";
import { browseListingPath } from "../routes";
import type { BrowseListing } from "../types";
import { useBrowseQuery } from "../use-browse-query";

/** Every available book, to search and open. */
export default function BrowseView() {
	const { query, search, setSearch, show } = useBrowseQuery();
	const setPage = useCallback((page: number) => show({ page }), [show]);
	const page = useBrowsePage(query);
	usePageInRange(query.page, setPage, page.error);
	const listings = page.data?.results ?? [];
	const total = page.data?.count ?? 0;
	const filtered = query.search !== "" || query.listing_type !== "";

	return (
		<section aria-label="Books" className="space-y-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<FilterChips
					label="Listing type"
					options={listingTypeFilters}
					value={query.listing_type}
					onChange={(listing_type) => show({ listing_type, page: 1 })}
				/>
				<SearchInput
					placeholder="Search title, author or course"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					className="sm:w-80"
				/>
			</div>

			<QueryState isPending={page.isPending} error={page.error} onRetry={page.refetch} />
			{page.isSuccess &&
				(listings.length === 0 ? (
					<EmptyState
						title={filtered ? "No books match" : "No books listed yet"}
						hint={
							filtered
								? "Try another search or listing type."
								: "Books students list will show here."
						}
					/>
				) : (
					<>
						<ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
							{listings.map((listing) => (
								<li key={listing.id}>
									<BrowseCard listing={listing} />
								</li>
							))}
						</ul>
						<Pagination
							page={query.page}
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

function BrowseCard({ listing }: { listing: BrowseListing }) {
	return (
		<ListingCard
			listing={listing}
			badge={viewerBadge(listing)}
			meta={listing.seller?.full_name}
			actions={
				<Button asChild size="sm" variant="secondary">
					<Link href={browseListingPath(listing.id)}>View details</Link>
				</Button>
			}
		/>
	);
}

/** How the listing stands for the signed-in student: theirs, or already asked for. */
function viewerBadge(listing: BrowseListing) {
	if (listing.is_owner) {
		return (
			<Badge tone="secondary" size="sm">
				Yours
			</Badge>
		);
	}
	if (listing.has_active_request) {
		return (
			<Badge tone="warning" size="sm">
				Requested
			</Badge>
		);
	}
	return null;
}
