import type { ListingType } from "@/features/listings/types";
import type { PublicUser, ViewerListing } from "@/features/student/types";

/** A listing on the browse pages, which anyone may open. */
export interface BrowseListing extends Omit<ViewerListing, "seller"> {
	/** `null` for visitors: who sells a book is only shown to students. */
	seller: PublicUser | null;
}

/** The browse page's filters, kept in its address so Back returns to the same results. */
export interface BrowseQuery {
	search: string;
	/** `""` for every type. */
	listing_type: ListingType | "";
	/** 1-based. */
	page: number;
}
