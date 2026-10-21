import type { BadgeTone } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";

import type { Condition, ListingStatus, ListingType } from "./types";

export const conditionLabels: Record<Condition, string> = {
	new: "New",
	like_new: "Like new",
	good: "Good",
	fair: "Fair",
	poor: "Poor",
};

export const listingStatusLabels: Record<ListingStatus, string> = {
	available: "Available",
	reserved: "Reserved",
	completed: "Completed",
	withdrawn: "Withdrawn",
};

export const listingStatusTones: Record<ListingStatus, BadgeTone> = {
	available: "success",
	reserved: "warning",
	completed: "primary",
	withdrawn: "neutral",
};

export const listingTypeLabels: Record<ListingType, string> = {
	sell: "For sale",
	exchange: "Swap",
	donate: "Donation",
};

/** Filter chips for browsing listings by type. */
export const listingTypeFilters: { value: ListingType | ""; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "sell", label: "For sale" },
	{ value: "exchange", label: "Swaps" },
	{ value: "donate", label: "Free" },
];

/** The asking price, or "Swap" / "Donation" for listings that have none. */
export function listingPrice(listing: { price: string | null; listing_type: ListingType }) {
	return listing.price === null
		? listingTypeLabels[listing.listing_type]
		: formatCurrency(Number(listing.price));
}
