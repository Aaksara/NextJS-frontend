import type { DraftSection } from "./types";

/** Why the layout cannot be published, or `null` when it can. Mirrors the API's checks. */
export function findLayoutProblem(sections: readonly DraftSection[]) {
	const untitled = sections.find((section) => !section.display_title.trim());
	if (untitled) return "Every section needs a display title.";

	const anchors = new Set<string>();
	for (const { anchor_id, display_title } of sections) {
		if (!anchor_id) return `"${display_title}" needs an anchor ID.`;
		if (anchors.has(anchor_id)) return `Anchor ID "${anchor_id}" is used twice.`;
		anchors.add(anchor_id);
	}
	return null;
}
