import { describe, expect, it } from "vitest";

import { filterBanners } from "./filters";
import type { Banner } from "./types";

function banner(id: number, fields: Partial<Banner>): Banner {
	return {
		id,
		title: "Banner",
		target_url: "https://akshara.app/",
		image: "https://api.akshara.app/media/banner.png",
		image_width: 1280,
		image_height: 480,
		alt_text: "",
		placement: "hero",
		status: "draft",
		position: id,
		updated_at: "2026-10-20T12:00:00Z",
		...fields,
	};
}

const banners = [
	banner(1, { title: "Spring textbook drive", target_url: "https://akshara.app/spring" }),
	banner(2, {
		title: "Safety tips",
		placement: "footer",
		target_url: "https://akshara.app/safety",
	}),
];

const ids = (list: Banner[]) => list.map((item) => item.id);

describe("filterBanners", () => {
	it("filters by placement", () =>
		expect(ids(filterBanners(banners, { placement: "footer", search: "" }))).toEqual([2]));

	it("searches titles and URLs, ignoring case", () => {
		expect(ids(filterBanners(banners, { placement: "all", search: "SPRING" }))).toEqual([1]);
		expect(ids(filterBanners(banners, { placement: "all", search: "/safety" }))).toEqual([2]);
	});
});
