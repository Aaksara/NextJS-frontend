import type { Slide } from "@/components/ui/image-slider";
import { API_URL } from "@/lib/api/api-client";

/** The home page sections the admin can hide or move, in their default order. */
export const HOME_SECTIONS = [
	"hero",
	"how_it_works",
	"listing_types",
	"safety",
	"call_to_action",
] as const;

export type HomeSectionKind = (typeof HOME_SECTIONS)[number];

/** The storefront's sliders. Each shows its own slides from the admin console. */
export type SliderKey = "home_hero" | "home_safety" | "sign_in";

type ApiSlide = { id: number; caption: string; link: string; image: string; alt_text: string };

/** Tags the home page's cached content; the admin console clears it after each change. */
export const HOME_CONTENT_TAG = "home-content";

/** Backstop for changes made outside the console, e.g. in Django's admin. */
const REVALIDATE_SECONDS = 60;

/**
 * Where this server reaches the API. Usually the public URL, but inside Docker the
 * backend has its own address (e.g. http://backend:8000).
 */
export const SERVER_API_URL = (process.env.API_INTERNAL_URL || API_URL).replace(/\/$/, "");

/** The API builds media links from the address it was called on; browsers need the public one. */
const toPublicUrl = (url: string) =>
	url.startsWith(SERVER_API_URL) ? API_URL + url.slice(SERVER_API_URL.length) : url;

const isHomeSectionKind = (kind: string): kind is HomeSectionKind =>
	(HOME_SECTIONS as readonly string[]).includes(kind);

/**
 * Public storefront content, cached until the console changes it (or for
 * `REVALIDATE_SECONDS`). Returns `fallback` when the API cannot be reached, e.g. during a
 * build, so the home page always renders.
 */
async function getPublic<T>(path: string, fallback: T): Promise<T> {
	try {
		const response = await fetch(SERVER_API_URL + path, {
			next: { tags: [HOME_CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
		});
		if (response.ok) return (await response.json()) as T;
		console.warn(`GET ${path} answered ${response.status}; showing the built-in content.`);
	} catch (error) {
		console.warn(`GET ${path} failed; showing the built-in content.`, error);
	}
	return fallback;
}

export const cmsService = {
	/** Kinds of the visible home page sections, top to bottom. */
	getHomeSections: async () => {
		const kinds = await getPublic<string[]>("/api/cms/home-sections/", [...HOME_SECTIONS]);
		// A kind added to the API before this app knows how to show it is skipped.
		return kinds.filter(isHomeSectionKind);
	},

	/** A slider's published slides, in order. Empty when it has none. */
	getSlides: async (slider: SliderKey): Promise<Slide[]> => {
		const slides = await getPublic<ApiSlide[]>(`/api/cms/slides/?slider=${slider}`, []);
		return slides.map((slide) => ({
			image: toPublicUrl(slide.image),
			alt: slide.alt_text,
			caption: slide.caption,
			href: slide.link || undefined,
		}));
	},
};
