import { describe, expect, it } from "vitest";

import { studentQueryParams } from "./query-params";
import type { StudentQuery } from "./types";

const base: StudentQuery = { search: "", verification: "any", account: "any", page: 1 };

describe("studentQueryParams", () => {
	it("leaves out filters set to any", () =>
		expect(studentQueryParams(base)).toBe("ordering=-date_joined&page=1&page_size=10"));

	it("maps filters to the API's fields", () => {
		const params = new URLSearchParams(
			studentQueryParams({
				search: " maya ",
				verification: "unverified",
				account: "suspended",
				page: 3,
			}),
		);
		expect(params.get("search")).toBe("maya");
		expect(params.get("is_email_verified")).toBe("false");
		expect(params.get("is_active")).toBe("false");
		expect(params.get("page")).toBe("3");
	});

	it("drops paging for exports", () =>
		expect(studentQueryParams({ ...base, page: 4 }, false)).toBe("ordering=-date_joined"));
});
