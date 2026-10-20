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

type ApiSlide = { id: number; caption: string; link: string; image: string; alt_text: string };

/** Admin changes reach the home page within this many seconds. */
const REVALIDATE_SECONDS = 60;

/**
 * Where this server reaches the API. Usually the public URL, but inside Docker the
 * backend has its own address (e.g. http://backend:8000).
 */
const SERVER_API_URL = (process.env.API_INTERNAL_URL || API_URL).replace(/\/$/, "");

/** The API builds media links from the address it was called on; browsers need the public one. */
const toPublicUrl = (url: string) =>
	url.startsWith(SERVER_API_URL) ? API_URL + url.slice(SERVER_API_URL.length) : url;

const isHomeSectionKind = (kind: string): kind is HomeSectionKind =>
	(HOME_SECTIONS as readonly string[]).includes(kind);

/**
 * Public storefront content, cached for `REVALIDATE_SECONDS`. Returns `fallback` when the
 * API cannot be reached, e.g. during a build, so the home page always renders.
 */
async function getPublic<T>(path: string, fallback: T): Promise<T> {
	try {
		const response = await fetch(SERVER_API_URL + path, {
			next: { revalidate: REVALIDATE_SECONDS },
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

	/** Published hero slides, in order. Empty when there are none. */
	getHeroSlides: async (): Promise<Slide[]> => {
		const slides = await getPublic<ApiSlide[]>("/api/cms/slides/", []);
		return slides.map((slide) => ({
			image: toPublicUrl(slide.image),
			alt: slide.alt_text,
			caption: slide.caption,
			href: slide.link || undefined,
		}));
	},
};
