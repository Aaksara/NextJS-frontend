import { describe, expect, it } from "vitest";

import { formatCount, formatCurrency, formatNumber, formatRelativeTime } from "./format";

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
	it.each([
		[450, "Rs. 450"],
		[100000, "Rs. 1,00,000"],
		[99.5, "Rs. 99.50"],
	])("formats %s rupees as %s", (value, expected) => {
		expect(formatCurrency(value)).toBe(expected);
	});
});

describe("formatCount", () => {
	it("uses the singular for one", () => expect(formatCount(1, "listing")).toBe("1 listing"));
	it("uses the plural otherwise", () => {
		expect(formatCount(0, "book")).toBe("0 books");
		expect(formatCount(1204, "student")).toBe("1,204 students");
	});
});
