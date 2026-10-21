import { requestApi } from "@/lib/api/api-client";
import type { SliderKey } from "@/services/cms.service";

import type { Slide } from "./types";

const SLIDES = "/api/admin/slides/";

export const slideService = {
	list: () => requestApi<Slide[]>(SLIDES),

	create: (form: FormData) => requestApi<Slide>(SLIDES, { body: form }),

	/** Only the fields sent change. Leave out `image` to keep the current one. */
	update: (id: number, changes: FormData | Partial<Pick<Slide, "is_published">>) =>
		requestApi<Slide>(`${SLIDES}${id}/`, { method: "PATCH", body: changes }),

	remove: (id: number) => requestApi(`${SLIDES}${id}/`, { method: "DELETE" }),

	addDefaults: (slider: SliderKey) =>
		requestApi<Slide[]>(`${SLIDES}add-defaults/`, { body: { slider } }),

	/** Saves one slider's order. `ids` must contain each of its slides exactly once. */
	reorder: (slider: SliderKey, ids: number[]) =>
		requestApi<Slide[]>(`${SLIDES}reorder/`, { body: { slider, ids } }),
};
