import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listingsKey } from "@/features/listings/keys";

import { browseService } from "./service";
import type { BrowseQuery } from "./types";

// Under the listings root, so a request sent from these pages refreshes them.
const browseKeys = {
	page: (query: BrowseQuery) => [...listingsKey, "browse", query] as const,
	listing: (id: number) => [...listingsKey, "browse", "detail", id] as const,
};

export function useBrowsePage(query: BrowseQuery) {
	return useQuery({
		queryKey: browseKeys.page(query),
		queryFn: () => browseService.list(query),
		placeholderData: keepPreviousData,
	});
}

export function useBrowseListing(id: number) {
	return useQuery({
		queryKey: browseKeys.listing(id),
		queryFn: () => browseService.listing(id),
	});
}
