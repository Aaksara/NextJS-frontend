import { describe, expect, it } from "vitest";

import { MAX_PHOTO_MB, photoProblem, removedPhotoIds } from "./photos";

describe("photoProblem", () => {
	it("accepts a JPEG within the size limit", () => {
		expect(photoProblem({ name: "cover.jpg", size: 1024, type: "image/jpeg" })).toBeNull();
	});

	it("rejects other file types", () => {
		expect(photoProblem({ name: "scan.pdf", size: 1024, type: "application/pdf" })).toBe(
			"scan.pdf is not a JPEG, PNG or WebP image.",
		);
	});

	it("rejects files over the upload limit", () => {
		expect(
			photoProblem({ name: "big.png", size: MAX_PHOTO_MB * 1024 * 1024 + 1, type: "image/png" }),
		).toBe("big.png is over 4 MB.");
	});
});

describe("removedPhotoIds", () => {
	const image = (id: number) => ({ id, image: `/media/${id}.jpg`, uploaded_at: "" });

	it("lists the photos that are no longer kept", () => {
		expect(removedPhotoIds([image(1), image(2), image(3)], [image(2)])).toEqual([1, 3]);
	});

	it("is empty when every photo is kept", () => {
		expect(removedPhotoIds([image(1)], [image(1)])).toEqual([]);
	});
});
