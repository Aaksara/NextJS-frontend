import { afterEach, describe, expect, it, vi } from "vitest";

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

/** Loads the service with `API_INTERNAL_URL` set, as in Docker. */
async function loadService() {
	vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000");
	vi.stubEnv("API_INTERNAL_URL", "http://backend:8000");
	vi.resetModules();
	return (await import("./cms.service")).cmsService;
}

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

describe("cmsService", () => {
	it("reads sections through the internal URL and skips unknown kinds", async () => {
		const fetchMock = vi.fn().mockResolvedValue(json(["safety", "carousel", "hero"]));
		vi.stubGlobal("fetch", fetchMock);
		const cms = await loadService();

		await expect(cms.getHomeSections()).resolves.toEqual(["safety", "hero"]);
		expect(fetchMock).toHaveBeenCalledWith(
			"http://backend:8000/api/cms/home-sections/",
			expect.anything(),
		);
	});

	it("gives browsers the public address of uploaded images", async () => {
		const slide = {
			id: 1,
			caption: "Spring drive",
			link: "",
			alt_text: "Shelves",
			image: "http://backend:8000/media/slides/a.webp",
		};
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json([slide])));
		const cms = await loadService();

		await expect(cms.getHeroSlides()).resolves.toEqual([
			{
				image: "http://localhost:8000/media/slides/a.webp",
				alt: "Shelves",
				caption: "Spring drive",
				href: undefined,
			},
		]);
	});

	it("falls back to the built-in home page when the API is down", async () => {
		vi.spyOn(console, "warn").mockImplementation(() => {});
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
		const cms = await loadService();

		await expect(cms.getHomeSections()).resolves.toEqual([
			"hero",
			"how_it_works",
			"listing_types",
			"safety",
			"call_to_action",
		]);
		await expect(cms.getHeroSlides()).resolves.toEqual([]);
	});
});
