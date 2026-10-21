import type { SectionContent } from "@/components/landing/content";
import type { HomeSectionKind } from "@/services/cms.service";

export interface HomeSectionLayout {
	kind: HomeSectionKind;
	is_enabled: boolean;
}

export interface HomeSection extends HomeSectionLayout {
	/** The admin's text for the section, or `{}` while it shows the built-in text. */
	content: SectionContent | Record<string, never>;
}
