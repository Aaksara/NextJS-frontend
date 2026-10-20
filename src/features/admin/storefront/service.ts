import { requestApi } from "@/lib/api/api-client";

import type { DraftSection, Platform, StorefrontLayout } from "./types";

const layoutUrl = (platform: Platform) => `/api/admin/layouts/${platform}/`;

export const storefrontService = {
	getLayout: (platform: Platform) => requestApi<StorefrontLayout>(layoutUrl(platform)),

	/**
	 * Publishes `sections` in order as the next version. Fails with 409 if another version
	 * was published after `baseVersion`, so a stale draft never overwrites newer work.
	 */
	publish: (platform: Platform, baseVersion: number, sections: DraftSection[]) =>
		requestApi<StorefrontLayout>(layoutUrl(platform), {
			method: "PUT",
			body: {
				base_version: baseVersion,
				sections: sections.map(({ id: _draftId, ...section }) => section),
			},
		}),
};
