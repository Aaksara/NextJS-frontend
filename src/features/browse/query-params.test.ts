import { describe, expect, it } from "vitest";

import { readBrowseQuery, writeBrowseQuery } from "./query-params";

const read = (search: string) => readBrowseQuery(new URLSearchParams(search));

describe("browse query params", () => {
	it("round-trips the filters", () => {
		const query = { search: "accounting", listing_type: "donate", page: 3 } as const;
		expect(read(writeBrowseQuery(query))).toEqual(query);
	});

	it("leaves the defaults out of the address", () => {
		expect(writeBrowseQuery({ search: "", listing_type: "", page: 1 })).toBe("");
	});

	it("ignores values it does not know", () => {
		expect(read("type=rent&page=-2")).toEqual({ search: "", listing_type: "", page: 1 });
		expect(read("page=2.5")).toEqual({ search: "", listing_type: "", page: 1 });
	});
});
