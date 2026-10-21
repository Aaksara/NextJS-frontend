import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/typography";
import { conditionLabels, listingPrice } from "@/features/listings/labels";

import type { Listing } from "../types";
import BookCover, { coverOf } from "./BookCover";

interface ListingCardProps {
	listing: Omit<Listing, "seller">;
	/** Over the cover's top right corner, e.g. the listing's status. */
	badge?: ReactNode;
	/** Under the price, e.g. a person's name or a hint. */
	meta?: ReactNode;
	/** Buttons along the bottom. */
	actions: ReactNode;
}

export default function ListingCard({ listing, badge, meta, actions }: ListingCardProps) {
	const { book } = listing;
	return (
		<article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
			<div className="relative bg-muted p-4">
				<BookCover
					src={coverOf(listing)}
					sizes="(min-width: 1024px) 220px, 45vw"
					className="mx-auto w-full max-w-44 shadow-md"
				/>
				<Badge
					tone="neutral"
					size="sm"
					className="absolute top-3 left-3 bg-card text-foreground shadow-sm"
				>
					{conditionLabels[listing.condition]}
				</Badge>
				{badge && <div className="absolute top-3 right-3">{badge}</div>}
			</div>
			<div className="flex flex-1 flex-col gap-1 p-4">
				{(listing.course_code || book.edition) && (
					<Text variant="label-sm" tone="muted" className="flex flex-wrap gap-2 uppercase">
						{listing.course_code && (
							<span className="rounded bg-primary-container px-1.5 text-primary-container-foreground">
								{listing.course_code}
							</span>
						)}
						{book.edition && <span>{book.edition}</span>}
					</Text>
				)}
				<Text as="h3" variant="label-lg" className="line-clamp-2">
					{book.title}
				</Text>
				{book.authors && (
					<Text variant="body-sm" tone="muted" className="line-clamp-1">
						{book.authors}
					</Text>
				)}
				<div className="mt-auto flex items-baseline justify-between gap-2 pt-3">
					<Text as="span" variant="headline-sm" className="text-primary tabular-nums">
						{listingPrice(listing)}
					</Text>
					{meta && (
						<Text as="span" variant="body-sm" tone="muted" className="truncate">
							{meta}
						</Text>
					)}
				</div>
			</div>
			<div className="flex gap-2 border-t p-3 [&>*]:flex-1">{actions}</div>
		</article>
	);
}
