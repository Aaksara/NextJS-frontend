import type { SectionContent } from "@/components/landing/content";
import { requestApi } from "@/lib/api/api-client";
import type { HomeSectionKind } from "@/services/cms.service";

import type { HomeSection, HomeSectionLayout } from "./types";

const HOME_SECTIONS = "/api/admin/home-sections/";

const contentUrl = (kind: HomeSectionKind) => `${HOME_SECTIONS}${kind}/content/`;

export const homeSectionService = {
	/** Every section, top to bottom. */
	list: () => requestApi<HomeSection[]>(HOME_SECTIONS),

	/** Saves the order and visibility. `sections` must contain every kind once. */
	save: (sections: HomeSectionLayout[]) =>
		requestApi<HomeSection[]>(HOME_SECTIONS, { method: "PUT", body: { sections } }),

	/** Replaces a section's text. Every field must be filled in. */
	saveContent: (kind: HomeSectionKind, content: SectionContent) =>
		requestApi<HomeSection>(contentUrl(kind), { method: "PUT", body: content }),

	/** Goes back to the site's built-in text. */
	resetContent: (kind: HomeSectionKind) =>
		requestApi<HomeSection>(contentUrl(kind), { method: "DELETE" }),
};
