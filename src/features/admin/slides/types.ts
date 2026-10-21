import type { SliderKey } from "@/services/cms.service";

export interface Slide {
	id: number;
	slider: SliderKey;
	caption: string;
	link: string;
	image: string;
	alt_text: string;
	is_published: boolean;
	position: number;
	updated_at: string;
}
