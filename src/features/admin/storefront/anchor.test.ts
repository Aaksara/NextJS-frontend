import { describe, expect, it } from "vitest";

import { toAnchorId } from "./anchor";

describe("toAnchorId", () => {
	it("slugifies titles", () => expect(toAnchorId("Spring Book Fair!")).toBe("spring-book-fair"));
	it("collapses separators", () => expect(toAnchorId("  a -- b  ")).toBe("a-b"));
	it("keeps a trailing hyphen while typing", () =>
		expect(toAnchorId("spring-", true)).toBe("spring-"));
});
