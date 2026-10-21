"use client";

import { ArrowLeft, BookX } from "lucide-react";
import { useState } from "react";

import EmptyState from "@/components/feedback/EmptyState";
import QueryState from "@/components/feedback/QueryState";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TextLink } from "@/components/ui/text-link";
import { Text } from "@/components/ui/typography";
import {
	conditionLabels,
	listingPrice,
	listingStatusLabels,
	listingStatusTones,
	listingTypeLabels,
} from "@/features/listings/labels";
import BookCover from "@/features/student/components/BookCover";
import { ApiRequestError } from "@/lib/api/api-client";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/utils";

import { useBrowseListing } from "../queries";
import { BROWSE } from "../routes";
import type { BrowseListing } from "../types";
import ListingAction from "./ListingAction";

export default function ListingDetailView({ id }: { id: number }) {
	const query = useBrowseListing(id);
	const notFound = query.error instanceof ApiRequestError && query.error.status === 404;

	return (
		<div className="space-y-6">
			<TextLink href={BROWSE} className="text-label-md">
				<ArrowLeft />
				All books
			</TextLink>
			{notFound ? (
				<EmptyState
					icon={BookX}
					title="This book is no longer listed"
					hint="The seller may have taken it down. Other copies may still be on offer."
				/>
			) : (
				<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			)}
			{query.data && <ListingDetail listing={query.data} />}
		</div>
	);
}

function ListingDetail({ listing }: { listing: BrowseListing }) {
	const { book } = listing;
	const details = [
		{ label: "Condition", value: conditionLabels[listing.condition] },
		{ label: "Edition", value: book.edition },
		{ label: "Course", value: listing.course_code },
		{ label: "ISBN", value: book.isbn_13 },
		{ label: "Listed", value: formatDate(listing.created_at) },
	].filter((detail) => detail.value);

	return (
		<article className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
			<Photos listing={listing} />

			<div className="space-y-6">
				<div className="space-y-3">
					<div className="flex flex-wrap gap-2">
						<Badge size="sm">{listingTypeLabels[listing.listing_type]}</Badge>
						{listing.status !== "available" && (
							<Badge size="sm" tone={listingStatusTones[listing.status]} dot>
								{listingStatusLabels[listing.status]}
							</Badge>
						)}
					</div>
					<div className="space-y-1">
						<Text as="h1" variant="headline-lg" className="text-primary">
							{book.title}
						</Text>
						{book.authors && (
							<Text variant="body-lg" tone="muted">
								{book.authors}
							</Text>
						)}
					</div>
					<Text variant="display-md" className="text-primary tabular-nums">
						{listingPrice(listing)}
					</Text>
				</div>

				<ListingAction listing={listing} />

				<dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y py-5 sm:grid-cols-3">
					{details.map(({ label, value }) => (
						<div key={label}>
							<Text as="dt" variant="label-sm" tone="muted" className="uppercase tracking-wider">
								{label}
							</Text>
							<Text as="dd" variant="label-lg">
								{value}
							</Text>
						</div>
					))}
				</dl>

				{listing.description && (
					<div className="space-y-1">
						<Text as="h2" variant="label-lg">
							Seller&apos;s notes
						</Text>
						<Text tone="muted" className="whitespace-pre-line">
							{listing.description}
						</Text>
					</div>
				)}

				<Seller listing={listing} />
			</div>
		</article>
	);
}

/** The seller's photos of the copy, else the edition's catalogue cover. */
function Photos({ listing }: { listing: BrowseListing }) {
	const photos = listing.images.map((image) => image.image);
	const [selected, setSelected] = useState(0);
	const src = photos[selected] ?? listing.book.cover_url;

	return (
		<div className="space-y-3">
			<div className="rounded-2xl bg-muted p-6 sm:p-10">
				<BookCover
					src={src}
					sizes="(min-width: 1024px) 360px, 80vw"
					className="mx-auto w-full max-w-72 shadow-lg"
				/>
			</div>
			{photos.length > 1 && (
				<ul className="flex flex-wrap gap-2">
					{photos.map((photo, index) => (
						<li key={photo}>
							<button
								type="button"
								aria-label={`Photo ${index + 1} of ${photos.length}`}
								aria-pressed={index === selected}
								onClick={() => setSelected(index)}
								className={cn(
									"block w-16 rounded-lg ring-offset-2 ring-offset-background transition",
									index === selected ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100",
								)}
							>
								<BookCover src={photo} sizes="64px" />
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function Seller({ listing }: { listing: BrowseListing }) {
	const { seller } = listing;
	if (!seller) {
		return (
			<Text variant="body-sm" tone="muted">
				Sign in to see which student is offering this book.
			</Text>
		);
	}
	return (
		<div className="flex items-center gap-3 rounded-xl border bg-card p-4">
			<Avatar name={seller.full_name} />
			<div className="min-w-0">
				<Text variant="label-lg" className="truncate">
					{listing.is_owner ? "You" : seller.full_name}
				</Text>
				<Text variant="body-sm" tone="muted" className="truncate">
					{[seller.department, `Member since ${formatDate(seller.date_joined)}`]
						.filter(Boolean)
						.join(" · ")}
				</Text>
			</div>
		</div>
	);
}
