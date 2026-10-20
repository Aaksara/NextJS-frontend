import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { refreshHomePage } from "@/features/admin/refresh-home-page";
import { getErrorMessage } from "@/lib/utils/page-helpers";

import { homeSectionService } from "./service";

const homeSectionKeys = { all: ["admin", "home-sections"] as const };

export function useHomeSections() {
	return useQuery({ queryKey: homeSectionKeys.all, queryFn: homeSectionService.list });
}

export function useSaveHomeSections() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: homeSectionService.save,
		onSuccess: (sections) => {
			queryClient.setQueryData(homeSectionKeys.all, sections);
			toast.success("Saved");
			return refreshHomePage();
		},
		onError: (error) => toast.error(getErrorMessage(error)),
	});
}
