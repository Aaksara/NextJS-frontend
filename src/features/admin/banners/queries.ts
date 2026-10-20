import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils/page-helpers";

import { bannerService } from "./service";
import type { Banner } from "./types";

const bannerKeys = { all: ["admin", "banners"] as const };

export function useBanners() {
	return useQuery({ queryKey: bannerKeys.all, queryFn: bannerService.list });
}

/** Creates a banner, or updates it when `id` is given. Errors are left to the form. */
export function useSaveBanner() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, form }: { id?: number; form: FormData }) =>
			id ? bannerService.update(id, form) : bannerService.create(form),
		onSuccess: (_banner, { id }) => toast.success(id ? "Banner updated" : "Banner created"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: bannerKeys.all }),
	});
}

export function useDeleteBanner() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: bannerService.remove,
		onSuccess: () => toast.success("Banner deleted"),
		onError: (error) => toast.error(getErrorMessage(error)),
		onSettled: () => queryClient.invalidateQueries({ queryKey: bannerKeys.all }),
	});
}

/** Saves a new order, showing it straight away and rolling back if the save fails. */
export function useReorderBanners() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (ordered: Banner[]) => bannerService.reorder(ordered.map((banner) => banner.id)),
		onMutate: async (ordered) => {
			await queryClient.cancelQueries({ queryKey: bannerKeys.all });
			const previous = queryClient.getQueryData<Banner[]>(bannerKeys.all);
			queryClient.setQueryData(
				bannerKeys.all,
				ordered.map((banner, position) => ({ ...banner, position })),
			);
			return { previous };
		},
		onError: (error, _ordered, context) => {
			queryClient.setQueryData(bannerKeys.all, context?.previous);
			toast.error(getErrorMessage(error));
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: bannerKeys.all }),
	});
}
