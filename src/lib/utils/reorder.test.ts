import { describe, expect, it } from "vitest";

import { moveItem } from "./reorder";

describe("moveItem", () => {
	it("moves an item down", () => expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]));
	it("moves an item up", () => expect(moveItem(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]));
	it("clamps the target index", () =>
		expect(moveItem(["a", "b", "c"], 0, 9)).toEqual(["b", "c", "a"]));
	it("leaves the input untouched", () => {
		const items = ["a", "b"];
		moveItem(items, 0, 1);
		expect(items).toEqual(["a", "b"]);
	});
});
