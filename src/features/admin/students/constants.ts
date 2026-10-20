import type { StudentListing } from "./types";

export const STUDENT_PAGE_SIZE = 10;

export const conditionLabels: Record<StudentListing["condition"], string> = {
	new: "New",
	like_new: "Like new",
	good: "Good",
	fair: "Fair",
	poor: "Poor",
};

export const listingStatusLabels: Record<StudentListing["status"], string> = {
	available: "Available",
	reserved: "Reserved",
	completed: "Completed",
	withdrawn: "Withdrawn",
};

export const listingTypeLabels: Record<StudentListing["listing_type"], string> = {
	sell: "For sale",
	exchange: "Swap",
	donate: "Donation",
};
