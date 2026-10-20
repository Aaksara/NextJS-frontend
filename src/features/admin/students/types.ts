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

export interface StudentListing {
	id: number;
	title: string;
	course_code: string;
	condition: "new" | "like_new" | "good" | "fair" | "poor";
	listing_type: "sell" | "exchange" | "donate";
	/** Decimal string, e.g. "25.00". `null` for swaps and donations. */
	price: string | null;
	status: "available" | "reserved" | "completed" | "withdrawn";
}

export interface StudentDetail extends Student {
	recent_listings: StudentListing[];
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
