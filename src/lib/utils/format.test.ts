import { describe, expect, it } from "vitest";

import { formatCurrency, formatNumber, formatRelativeTime } from "./format";

describe("formatRelativeTime", () => {
	const now = new Date("2026-10-20T12:00:00Z");

	it.each([
		["2026-10-18T12:00:00Z", "2d ago"],
		["2026-10-20T09:00:00Z", "3h ago"],
		["2026-10-20T11:59:30Z", "now"],
		["2026-10-21T12:00:00Z", "tomorrow"],
	])("formats %s as %s", (iso, expected) => {
		expect(formatRelativeTime(iso, now)).toBe(expected);
	});
});

describe("number formats", () => {
	it("groups thousands", () => expect(formatNumber(14892)).toBe("14,892"));
	it("formats dollars", () => expect(formatCurrency(45)).toBe("$45.00"));
});
