import type { HomeSectionKind } from "@/services/cms.service";

export const sectionInfo: Record<HomeSectionKind, { label: string; description: string }> = {
	hero: {
		label: "Hero",
		description: "Headline, sign-up button and the home page's top slider.",
	},
	how_it_works: {
		label: "How it works",
		description: "The three steps of an exchange.",
	},
	listing_types: {
		label: "Sell, swap, donate",
		description: "The three ways to pass a book on.",
	},
	safety: {
		label: "Safety",
		description: "Verified students and approved meetup spots.",
	},
	call_to_action: {
		label: "Call to action",
		description: "Closing sign-up prompt. Signed-in students never see it.",
	},
};
