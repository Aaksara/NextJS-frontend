import { requestApi } from "@/lib/api/api-client";

import type { CampusSettings, MeetupLocation, MeetupLocationInput } from "./types";

const LOCATIONS = "/api/admin/meetup-locations/";

export const campusService = {
	getSettings: () => requestApi<CampusSettings>("/api/admin/campus/"),

	listLocations: () => requestApi<MeetupLocation[]>(LOCATIONS),

	createLocation: (input: MeetupLocationInput) =>
		requestApi<MeetupLocation>(LOCATIONS, { body: input }),

	updateLocation: (id: number, changes: Partial<MeetupLocationInput>) =>
		requestApi<MeetupLocation>(`${LOCATIONS}${id}/`, { method: "PATCH", body: changes }),
};
