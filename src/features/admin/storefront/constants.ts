import {
	BadgeCheck,
	Footprints,
	type LucideIcon,
	Megaphone,
	PanelTop,
	Repeat,
	ShieldCheck,
	Sparkles,
} from "lucide-react";

import type { Platform, SectionKind, SectionVariant } from "./types";

export const platformLabels: Record<Platform, string> = {
	web: "Website",
	mobile: "Mobile app",
};

export const sectionCatalog: Record<
	SectionKind,
	{ label: string; description: string; icon: LucideIcon }
> = {
	header: {
		label: "Header and navigation",
		description: "Logo, section links and sign-in buttons.",
		icon: PanelTop,
	},
	hero: {
		label: "Hero",
		description: "Headline, sign-up button and the image slider.",
		icon: Sparkles,
	},
	how_it_works: {
		label: "How it works",
		description: "The three steps of an exchange.",
		icon: BadgeCheck,
	},
	listing_types: {
		label: "Sell, swap, donate",
		description: "The three ways to pass a book on.",
		icon: Repeat,
	},
	safety: {
		label: "Safety",
		description: "Verified students and approved meetup spots.",
		icon: ShieldCheck,
	},
	call_to_action: {
		label: "Call to action",
		description: "Closing banner that asks visitors to sign up.",
		icon: Megaphone,
	},
	footer: {
		label: "Footer",
		description: "Site links and policies.",
		icon: Footprints,
	},
};

export const variantOptions: Record<SectionVariant, { label: string; description: string }> = {
	light: {
		label: "Modern light",
		description: "White background with subtle borders. Suits daytime browsing.",
	},
	navy: {
		label: "Collegiate navy",
		description: "Deep navy with gold accents, matching the brand.",
	},
};
