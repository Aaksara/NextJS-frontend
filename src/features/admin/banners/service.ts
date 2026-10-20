import { requestApi } from "@/lib/api/api-client";

import type { Banner } from "./types";

const BANNERS = "/api/admin/banners/";

export const bannerService = {
	/** Every banner, in display order. */
	list: () => requestApi<Banner[]>(BANNERS),

	/** `form` holds the banner fields and, for a new banner, its `image` file. */
	create: (form: FormData) => requestApi<Banner>(BANNERS, { body: form }),

	/** Only the fields in `form` change. Leave out `image` to keep the current one. */
	update: (id: number, form: FormData) =>
		requestApi<Banner>(`${BANNERS}${id}/`, { method: "PATCH", body: form }),

	remove: (id: number) => requestApi(`${BANNERS}${id}/`, { method: "DELETE" }),

	/** Saves the display order. `ids` must contain every banner exactly once. */
	reorder: (ids: number[]) => requestApi<Banner[]>(`${BANNERS}reorder/`, { body: { ids } }),
};
