import { formatCurrency } from "@/lib/utils/format";

import { listingTypeLabels } from "./constants";
import type { StudentListing } from "./types";

/** The asking price, or "Swap" / "Donation" for listings that have none. */
export function listingPrice(listing: StudentListing) {
	return listing.price === null
		? listingTypeLabels[listing.listing_type]
		: formatCurrency(Number(listing.price));
}
