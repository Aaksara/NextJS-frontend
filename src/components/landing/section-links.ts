import { BROWSE } from "@/features/browse/routes";
import type { HomeSectionKind } from "@/services/cms.service";

// Absolute, so they also lead back to the home page from the browse pages.
const sectionLinks: { section: HomeSectionKind; href: string; label: string }[] = [
	{ section: "how_it_works", href: "/#how-it-works", label: "How it works" },
	{ section: "listing_types", href: "/#sell-swap-donate", label: "Sell, swap, donate" },
	{ section: "safety", href: "/#safety", label: "Safety" },
];

/** Browsing, then the links whose section is on the home page, so none of them leads nowhere. */
export function linksTo(visibleSections: readonly HomeSectionKind[]) {
	return [
		{ href: BROWSE, label: "Browse books" },
		...sectionLinks.filter((link) => visibleSections.includes(link.section)),
	];
}
