import { requestApi } from "@/lib/api/api-client";

import type { HomeSection } from "./types";

const HOME_SECTIONS = "/api/admin/home-sections/";

export const homeSectionService = {
	/** Every section, top to bottom. */
	list: () => requestApi<HomeSection[]>(HOME_SECTIONS),

	/** Saves the order and visibility. `sections` must contain every kind once. */
	save: (sections: HomeSection[]) =>
		requestApi<HomeSection[]>(HOME_SECTIONS, { method: "PUT", body: { sections } }),
};
