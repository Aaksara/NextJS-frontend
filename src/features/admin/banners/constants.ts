import type { BadgeTone } from "@/components/ui/badge";

import type { BannerPlacement, BannerStatus } from "./types";

export const placementLabels: Record<BannerPlacement, string> = {
	hero: "Hero carousel",
	promotion: "Promotion",
	footer: "Footer notice",
};

export const statusMeta: Record<BannerStatus, { label: string; tone: BadgeTone }> = {
	published: { label: "Published", tone: "success" },
	draft: { label: "Draft", tone: "neutral" },
};

/** Formats the backend accepts, and its upload limit. */
export const ACCEPTED_IMAGE_TYPES = "image/png,image/jpeg,image/webp";
export const MAX_IMAGE_MB = 4;
