import type { SliderKey } from "@/services/cms.service";

/** As returned by `/api/admin/slides/`. */
export interface Slide {
	id: number;
	/** Which slider on the site shows it. */
	slider: SliderKey;
	caption: string;
	/** Optional page the caption links to. Empty when there is none. */
	link: string;
	/** Absolute URL of the uploaded image. */
	image: string;
	alt_text: string;
	/** Only published slides appear on the site. */
	is_published: boolean;
	position: number;
	updated_at: string;
}
