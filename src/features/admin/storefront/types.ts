export type Platform = "web" | "mobile";

/** The storefront home page's sections, as in src/components/landing. */
export type SectionKind =
	| "header"
	| "hero"
	| "how_it_works"
	| "listing_types"
	| "safety"
	| "call_to_action"
	| "footer";

export type SectionVariant = "light" | "navy";

/** As returned by `/api/admin/layouts/<platform>/`. */
export interface PageSection {
	id: number;
	kind: SectionKind;
	display_title: string;
	/** In-page anchor, e.g. "how-it-works". */
	anchor_id: string;
	is_enabled: boolean;
	variant: SectionVariant;
}

/** The live sections of one platform and the release that published them. */
export interface StorefrontLayout {
	platform: Platform;
	/** 0 before the first publish. */
	version: number;
	published_at: string | null;
	published_by: string | null;
	sections: PageSection[];
}

/** A section being edited. It has a temporary id until the layout is published. */
export type DraftSection = Omit<PageSection, "id"> & { id: string };
