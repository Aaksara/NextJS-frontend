import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useSession } from "@/components/landing/session";
import { listingsKey } from "@/features/listings/keys";

import { browseService } from "./service";
import type { BrowseQuery } from "./types";

/**
 * Under the listings root, so a request sent from these pages refreshes them. Keyed by the
 * viewer too: a visitor gets no sellers, and signing out must not leave a student's view.
 */
const browseKeys = {
	page: (viewer: number | null, query: BrowseQuery) =>
		[...listingsKey, "public", viewer, query] as const,
	listing: (viewer: number | null, id: number) =>
		[...listingsKey, "public", viewer, "detail", id] as const,
};

/** The signed-in user's id, `null` for visitors, `undefined` while the session loads. */
function useViewer() {
	const { user } = useSession();
	return user === undefined ? undefined : (user?.id ?? null);
}

export function useBrowsePage(query: BrowseQuery) {
	const viewer = useViewer();
	return useQuery({
		queryKey: browseKeys.page(viewer ?? null, query),
		queryFn: () => browseService.list(query),
		enabled: viewer !== undefined,
		placeholderData: keepPreviousData,
	});
}

export function useBrowseListing(id: number) {
	const viewer = useViewer();
	return useQuery({
		queryKey: browseKeys.listing(viewer ?? null, id),
		queryFn: () => browseService.listing(id),
		enabled: viewer !== undefined,
	});
}
