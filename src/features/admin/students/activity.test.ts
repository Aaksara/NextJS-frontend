import { describe, expect, it } from "vitest";

import { describeActivity } from "./activity";
import type { ActivityEvent } from "./types";

const event = (fields: Partial<ActivityEvent>): ActivityEvent => ({
	id: "request-1-requested",
	kind: "requested",
	at: "2026-10-01T10:00:00Z",
	role: "buyer",
	listing_id: 1,
	book_title: "Dune",
	counterpart: "Sam Lee",
	...fields,
});

describe("describeActivity", () => {
	it("words a request from each side", () => {
		expect(describeActivity(event({ role: "buyer" }))).toBe("Requested “Dune” from Sam Lee");
		expect(describeActivity(event({ role: "seller" }))).toBe("Sam Lee requested “Dune”");
	});

	it("does not say who declined, since declines can be automatic", () =>
		expect(describeActivity(event({ kind: "rejected", role: "buyer" }))).toBe(
			"Request for “Dune” was declined",
		));

	it("needs no book or other student for joining", () =>
		expect(describeActivity(event({ kind: "joined", role: "", book_title: "" }))).toBe(
			"Joined the marketplace",
		));
});
