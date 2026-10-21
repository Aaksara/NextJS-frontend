import { describe, expect, it } from "vitest";

import { safeReturnPath } from "./session";

describe("safeReturnPath", () => {
	it("keeps paths inside the portal", () => {
		expect(safeReturnPath("/student")).toBe("/student");
		expect(safeReturnPath("/student/listings")).toBe("/student/listings");
	});

	it("keeps the browse pages, so a visitor returns to the book they wanted", () => {
		expect(safeReturnPath("/browse")).toBe("/browse");
		expect(safeReturnPath("/browse/12")).toBe("/browse/12");
	});

	it("falls back to the overview for anything else", () => {
		expect(safeReturnPath(null)).toBe("/student");
		expect(safeReturnPath("https://evil.example")).toBe("/student");
		expect(safeReturnPath("//evil.example/student")).toBe("/student");
		expect(safeReturnPath("/students-elsewhere")).toBe("/student");
		expect(safeReturnPath("/admin")).toBe("/student");
		expect(safeReturnPath("/browser")).toBe("/student");
	});
});
