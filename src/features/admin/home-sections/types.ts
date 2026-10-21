import type { SectionContent } from "@/components/landing/content";
import type { HomeSectionKind } from "@/services/cms.service";

/** Where a section sits and whether it shows: what the order editor saves. */
export interface HomeSectionLayout {
	kind: HomeSectionKind;
	is_enabled: boolean;
}

/** As returned by `/api/admin/home-sections/`, top to bottom. */
export interface HomeSection extends HomeSectionLayout {
	/** The admin's text for the section, or `{}` while it shows the built-in text. */
	content: SectionContent | Record<string, never>;
}
