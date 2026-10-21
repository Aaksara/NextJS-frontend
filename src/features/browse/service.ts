import { type Paginated, requestApi } from "@/lib/api/api-client";

import { BROWSE_PAGE_SIZE } from "./constants";
import type { BrowseListing, BrowseQuery } from "./types";

const LISTINGS = "/api/listings/";

export const browseService = {
	/** Available listings, newest first. Works signed out. */
	list: ({ search, listing_type, page }: BrowseQuery) => {
		const params = new URLSearchParams({ page: String(page), page_size: String(BROWSE_PAGE_SIZE) });
		if (search) params.set("search", search);
		if (listing_type) params.set("listing_type", listing_type);
		return requestApi<Paginated<BrowseListing>>(`${LISTINGS}?${params}`);
	},

	listing: (id: number) => requestApi<BrowseListing>(`${LISTINGS}${id}/`),
};
