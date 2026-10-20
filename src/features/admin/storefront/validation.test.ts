import { describe, expect, it } from "vitest";

import type { DraftSection } from "./types";
import { findLayoutProblem } from "./validation";

function section(id: string, fields: Partial<DraftSection> = {}): DraftSection {
	return {
		id,
		kind: "hero",
		display_title: `Section ${id}`,
		anchor_id: `section-${id}`,
		is_enabled: true,
		variant: "light",
		...fields,
	};
}

describe("findLayoutProblem", () => {
	it("accepts titled sections with unique anchors", () =>
		expect(findLayoutProblem([section("1"), section("2")])).toBeNull());

	it("rejects a blank title", () =>
		expect(findLayoutProblem([section("1", { display_title: "  " })])).toMatch(/display title/));

	it("rejects a missing anchor", () =>
		expect(findLayoutProblem([section("1", { anchor_id: "" })])).toMatch(/needs an anchor/));

	it("rejects a repeated anchor", () =>
		expect(findLayoutProblem([section("1"), section("2", { anchor_id: "section-1" })])).toMatch(
			/used twice/,
		));
});
