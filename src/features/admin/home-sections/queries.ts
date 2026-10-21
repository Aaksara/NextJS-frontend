import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { SectionContent } from "@/components/landing/content";
import { refreshHomePage } from "@/features/admin/refresh-home-page";
import { getErrorMessage } from "@/lib/utils/page-helpers";
import type { HomeSectionKind } from "@/services/cms.service";

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

function useContentMutation<Input>(
	mutationFn: (input: Input) => Promise<unknown>,
	{ successMessage, toastErrors }: { successMessage: string; toastErrors: boolean },
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn,
		onSuccess: () => {
			toast.success(successMessage);
			return refreshHomePage();
		},
		onError: (error) => {
			if (toastErrors) toast.error(getErrorMessage(error));
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: homeSectionKeys.all }),
	});
}

/** Errors are shown by the form, next to the fields they are about. */
export const useSaveSectionContent = () =>
	useContentMutation(
		({ kind, content }: { kind: HomeSectionKind; content: SectionContent }) =>
			homeSectionService.saveContent(kind, content),
		{ successMessage: "Section text saved", toastErrors: false },
	);

export const useResetSectionContent = () =>
	useContentMutation(homeSectionService.resetContent, {
		successMessage: "Back to the built-in text",
		toastErrors: true,
	});
