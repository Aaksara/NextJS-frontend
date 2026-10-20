import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { refreshHomePage } from "@/features/admin/refresh-home-page";
import { getErrorMessage } from "@/lib/utils/page-helpers";

import { slideService } from "./service";
import type { Slide } from "./types";

const slideKeys = { all: ["admin", "slides"] as const };

export function useSlides() {
	return useQuery({ queryKey: slideKeys.all, queryFn: slideService.list });
}

/**
 * Refreshes the slide list and the home page after any change. Shows `successMessage` if
 * given, and errors unless a form shows them itself.
 */
function useSlideMutation<Input>(
	mutationFn: (input: Input) => Promise<unknown>,
	{ successMessage, toastErrors = true }: { successMessage?: string; toastErrors?: boolean } = {},
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn,
		onSuccess: () => {
			if (successMessage) toast.success(successMessage);
			return refreshHomePage();
		},
		onError: (error) => {
			if (toastErrors) toast.error(getErrorMessage(error));
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: slideKeys.all }),
	});
}

/** Creates a slide, or updates it when `id` is given. Errors are shown by the form. */
export const useSaveSlide = () =>
	useSlideMutation(
		({ id, form }: { id?: number; form: FormData }) =>
			id ? slideService.update(id, form) : slideService.create(form),
		{ successMessage: "Slide saved", toastErrors: false },
	);

export const usePublishSlide = () =>
	useSlideMutation(
		({ id, is_published }: { id: number; is_published: boolean }) =>
			slideService.update(id, { is_published }),
		{ successMessage: "Slide updated" },
	);

export const useDeleteSlide = () =>
	useSlideMutation(slideService.remove, { successMessage: "Slide deleted" });

/** No success message: the list itself shows the new order. */
export const useReorderSlides = () =>
	useSlideMutation((ordered: Slide[]) => slideService.reorder(ordered.map((slide) => slide.id)));
