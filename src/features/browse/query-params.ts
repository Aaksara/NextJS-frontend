import type { ListingType } from "@/features/listings/types";

import type { BrowseQuery } from "./types";

const listingTypes: readonly string[] = ["sell", "exchange", "donate"] satisfies ListingType[];

/** Reads the filters from the page's address, ignoring values it does not know. */
export function readBrowseQuery(params: URLSearchParams): BrowseQuery {
	const type = params.get("type") ?? "";
	const page = Number(params.get("page"));
	return {
		search: params.get("q")?.trim() ?? "",
		listing_type: listingTypes.includes(type) ? (type as ListingType) : "",
		page: Number.isInteger(page) && page > 1 ? page : 1,
	};
}

/** The address's query string for `query`, leaving out the defaults. */
export function writeBrowseQuery({ search, listing_type, page }: BrowseQuery) {
	const params = new URLSearchParams();
	if (search) params.set("q", search);
	if (listing_type) params.set("type", listing_type);
	if (page > 1) params.set("page", String(page));
	return params.toString();
}
