/** As returned by `/api/admin/students/`. */
export interface Student {
	id: number;
	email: string;
	full_name: string;
	student_id: string;
	department: string;
	phone: string;
	is_email_verified: boolean;
	/** `false` once suspended: the student cannot sign in. */
	is_active: boolean;
	date_joined: string;
	last_login: string | null;
	listing_count: number;
	/** Listings that are available or reserved. */
	active_listing_count: number;
	request_count: number;
}

export type ListingStatus = "available" | "reserved" | "completed" | "withdrawn";

export interface StudentListing {
	id: number;
	title: string;
	/** Comma separated. */
	authors: string;
	course_code: string;
	condition: "new" | "like_new" | "good" | "fair" | "poor";
	listing_type: "sell" | "exchange" | "donate";
	/** Decimal string, e.g. "25.00". `null` for swaps and donations. */
	price: string | null;
	status: ListingStatus;
	/** Exchange requests the listing has drawn, in any state. */
	request_count: number;
	created_at: string;
}

export interface StudentDetail extends Student {
	recent_listings: StudentListing[];
}

export interface StudentListingQuery {
	/** `""` for every status. */
	status: ListingStatus | "";
	/** 1-based. */
	page: number;
}

/**
 * One event in a student's history. `role` is the student's side of it: "buyer" when they
 * asked for the book, "seller" when it is theirs, and `""` for events with no other side.
 */
export interface ActivityEvent {
	/** Unique within one student's history. */
	id: string;
	kind:
		| "joined"
		| "listed"
		| "requested"
		| "accepted"
		| "rejected"
		| "cancelled"
		| "completed"
		| "messaged";
	at: string;
	role: "buyer" | "seller" | "";
	listing_id: number | null;
	book_title: string;
	/** Full name of the other student. */
	counterpart: string;
}

export interface ActivityPage {
	/** Newest first. */
	results: ActivityEvent[];
	/** Whether older events exist beyond `results`. */
	has_more: boolean;
}

export interface DirectorySummary {
	students: number;
	verified: number;
	suspended: number;
	joined_this_week: number;
	/** Students with an available or reserved listing. */
	active_sellers: number;
	/** Students with a pending or accepted exchange request. */
	active_buyers: number;
}

/** Which students the directory lists. */
export type StudentFilter = "all" | "unverified" | "suspended";

export interface StudentQuery {
	search: string;
	filter: StudentFilter;
	/** 1-based. */
	page: number;
}
