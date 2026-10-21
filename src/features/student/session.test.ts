import { describe, expect, it } from "vitest";

import { safeStudentPath } from "./session";

describe("safeStudentPath", () => {
	it("keeps paths inside the portal", () => {
		expect(safeStudentPath("/student")).toBe("/student");
		expect(safeStudentPath("/student/listings")).toBe("/student/listings");
	});

	it("falls back to the overview for anything else", () => {
		expect(safeStudentPath(null)).toBe("/student");
		expect(safeStudentPath("https://evil.example")).toBe("/student");
		expect(safeStudentPath("//evil.example/student")).toBe("/student");
		expect(safeStudentPath("/students-elsewhere")).toBe("/student");
		expect(safeStudentPath("/admin")).toBe("/student");
	});
});
