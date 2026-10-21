import { describe, expect, it } from "vitest";

import { listingQueryParams, studentQueryParams } from "./query-params";
import type { StudentQuery } from "./types";

const base: StudentQuery = { search: "", filter: "all", page: 1 };

describe("studentQueryParams", () => {
	it("lists everyone by default", () =>
		expect(studentQueryParams(base)).toBe("ordering=-date_joined&page=1&page_size=10"));

	it("maps the filter and search to the API's fields", () => {
		const unverified = new URLSearchParams(
			studentQueryParams({ search: " maya ", filter: "unverified", page: 3 }),
		);
		const suspended = new URLSearchParams(studentQueryParams({ ...base, filter: "suspended" }));

		expect(unverified.get("search")).toBe("maya");
		expect(unverified.get("is_email_verified")).toBe("false");
		expect(unverified.get("page")).toBe("3");
		expect(suspended.get("is_active")).toBe("false");
	});

	it("drops paging for exports", () =>
		expect(studentQueryParams({ ...base, page: 4 }, false)).toBe("ordering=-date_joined"));
});

describe("listingQueryParams", () => {
	it("leaves the status out to list every listing", () =>
		expect(listingQueryParams({ status: "", page: 1 })).toBe("page=1&page_size=10"));

	it("narrows to one status", () =>
		expect(
			new URLSearchParams(listingQueryParams({ status: "withdrawn", page: 2 })).get("status"),
		).toBe("withdrawn"));
});
