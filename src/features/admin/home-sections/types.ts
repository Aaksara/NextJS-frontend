import type { HomeSectionKind } from "@/services/cms.service";

/** As returned by `/api/admin/home-sections/`, top to bottom. */
export interface HomeSection {
	kind: HomeSectionKind;
	is_enabled: boolean;
}
