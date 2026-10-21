import type { BadgeTone } from "@/components/ui/badge";

import type { ListingStatus, StudentListing } from "./types";

export const STUDENT_PAGE_SIZE = 10;

export const LISTING_PAGE_SIZE = 10;

/** Activity events loaded at first, and added by each "Show older". */
export const ACTIVITY_PAGE_SIZE = 30;

/** The API's cap on `limit` (`MAX_ACTIVITY` in `console/serializers.py`). */
export const MAX_ACTIVITY = 500;

export const conditionLabels: Record<StudentListing["condition"], string> = {
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

export const listingTypeLabels: Record<StudentListing["listing_type"], string> = {
	sell: "For sale",
	exchange: "Swap",
	donate: "Donation",
};
