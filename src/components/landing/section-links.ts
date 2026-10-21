import type { HomeSectionKind } from "@/services/cms.service";

const sectionLinks: { section: HomeSectionKind; href: string; label: string }[] = [
	{ section: "how_it_works", href: "#how-it-works", label: "How it works" },
	{ section: "listing_types", href: "#sell-swap-donate", label: "Sell, swap, donate" },
	{ section: "safety", href: "#safety", label: "Safety" },
];

/** The links whose section is on the page, so none of them leads nowhere. */
export function linksTo(visibleSections: readonly HomeSectionKind[]) {
	return sectionLinks.filter((link) => visibleSections.includes(link.section));
}
