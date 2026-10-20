import type { Banner, BannerPlacement } from "./types";

export type PlacementFilter = BannerPlacement | "all";

export function filterBanners(
	banners: readonly Banner[],
	{ placement, search }: { placement: PlacementFilter; search: string },
) {
	const query = search.trim().toLowerCase();
	return banners.filter(
		(banner) =>
			(placement === "all" || banner.placement === placement) &&
			(!query ||
				banner.title.toLowerCase().includes(query) ||
				banner.target_url.toLowerCase().includes(query)),
	);
}
