import type { Condition, ListingStatus, ListingType } from "@/features/listings/types";

/** What students can see about each other. */
export interface PublicUser {
	id: number;
	full_name: string;
	department: string;
	avatar: string | null;
	date_joined: string;
}

export interface BookSummary {
	id: number;
	/** `null` for the many local textbooks without one. */
	isbn_13: string | null;
	title: string;
	/** Comma separated. */
	authors: string;
	edition: string;
	cover_url: string;
}

export interface ListingImage {
	id: number;
	image: string;
	uploaded_at: string;
}

export interface Listing {
	id: number;
	book: BookSummary;
	seller: PublicUser;
	/** The signed-in student listed it. */
	is_owner: boolean;
	condition: Condition;
	listing_type: ListingType;
	/** Decimal string, e.g. "25.00". `null` for swaps and donations. */
	price: string | null;
	description: string;
	course_code: string;
	status: ListingStatus;
	images: ListingImage[];
	created_at: string;
	updated_at: string;
}

/** A listing from the listing endpoints, which add the viewer's own request on it. */
export interface ViewerListing extends Listing {
	/** The signed-in student has a pending or accepted request for it. */
	has_active_request: boolean;
}

/**
 * A listing as the seller fills it in. The book's details match a catalogue book or add one,
 * so the same book listed twice is found together.
 */
export interface ListingInput {
	title: string;
	authors: string;
	edition: string;
	condition: Condition;
	listing_type: ListingType;
	price: string | null;
	course_code: string;
	description: string;
}

/** Sellers may only switch between these two; exchanges set the other statuses. */
export type ListingChanges = Partial<ListingInput> & { status?: "available" | "withdrawn" };

export interface ListingQuery {
	search: string;
	/** `""` for every type. */
	listing_type: ListingType | "";
	/** 1-based. */
	page: number;
}

export interface MyListingQuery {
	/** `""` for every status. */
	status: ListingStatus | "";
	page: number;
}

export type ExchangeStatus = "pending" | "accepted" | "rejected" | "cancelled" | "completed";

export interface Exchange {
	id: number;
	listing_detail: Listing;
	requester: PublicUser;
	seller: PublicUser;
	/** The signed-in student's side: "seller" when the listing is theirs. */
	role: "seller" | "requester";
	offered_price: string | null;
	offered_listing_detail: Listing | null;
	message: string;
	status: ExchangeStatus;
	/** The other student's details while the exchange is accepted, to arrange the handover. */
	contact: { email: string; phone: string } | null;
	responded_at: string | null;
	completed_at: string | null;
	created_at: string;
}

export interface ExchangeInput {
	listing: number;
	/** For listings on sale. Defaults to the asking price. */
	offered_price?: string;
	/** For swaps: one of the requester's own available listings. */
	offered_listing?: number;
	message: string;
}

/** The overview's exchange tabs, by what the student has to do. */
export type ExchangeGroup = "review" | "accepted" | "sent";

export interface ExchangeQuery {
	group: ExchangeGroup;
	/** 1-based. */
	page: number;
}
