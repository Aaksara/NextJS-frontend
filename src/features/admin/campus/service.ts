import { requestApi } from "@/lib/api/api-client";

import type { CampusSettings } from "./types";

export const campusService = {
	getSettings: () => requestApi<CampusSettings>("/api/admin/campus/"),
};
