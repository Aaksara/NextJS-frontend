import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils/page-helpers";

import { campusService } from "./service";
import type { MeetupLocationInput } from "./types";

const campusKeys = {
	settings: ["admin", "campus"] as const,
	locations: ["admin", "meetup-locations"] as const,
};

export function useCampusSettings() {
	return useQuery({ queryKey: campusKeys.settings, queryFn: campusService.getSettings });
}

export function useMeetupLocations() {
	return useQuery({ queryKey: campusKeys.locations, queryFn: campusService.listLocations });
}

/** Creates a location, or updates it when `id` is given. Errors are left to the form. */
export function useSaveLocation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, input }: { id?: number; input: MeetupLocationInput }) =>
			id ? campusService.updateLocation(id, input) : campusService.createLocation(input),
		onSuccess: (_location, { id }) => toast.success(id ? "Location updated" : "Location added"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: campusKeys.locations }),
	});
}

export function useSetLocationActive() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
			campusService.updateLocation(id, { is_active }),
		onSuccess: (location) =>
			toast.success(location.is_active ? `${location.name} restored` : `${location.name} retired`),
		onError: (error) => toast.error(getErrorMessage(error)),
		onSettled: () => queryClient.invalidateQueries({ queryKey: campusKeys.locations }),
	});
}
