import { describe, expect, it } from "vitest";

import { safeNextPath } from "./admin-session";

describe("safeNextPath", () => {
	it("keeps console paths", () => expect(safeNextPath("/admin/students")).toBe("/admin/students"));

	it.each([null, "", "https://evil.example", "//evil.example/admin/x", "/login", "/admin/login"])(
		"falls back to the console home for %s",
		(next) => expect(safeNextPath(next)).toBe("/admin"),
	);
});
