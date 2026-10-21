import { useQuery } from "@tanstack/react-query";

import { campusService } from "./service";

const campusKeys = {
	settings: ["admin", "campus"] as const,
};

export function useCampusSettings() {
	return useQuery({ queryKey: campusKeys.settings, queryFn: campusService.getSettings });
}
