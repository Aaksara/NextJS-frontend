import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils/page-helpers";

import { storefrontService } from "./service";
import type { DraftSection, Platform } from "./types";

const storefrontKeys = {
	layout: (platform: Platform) => ["admin", "layout", platform] as const,
};

export function useStorefrontLayout(platform: Platform) {
	return useQuery({
		queryKey: storefrontKeys.layout(platform),
		queryFn: () => storefrontService.getLayout(platform),
	});
}

export function usePublishLayout(platform: Platform) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ baseVersion, sections }: { baseVersion: number; sections: DraftSection[] }) =>
			storefrontService.publish(platform, baseVersion, sections),
		onSuccess: (layout) => {
			queryClient.setQueryData(storefrontKeys.layout(platform), layout);
			toast.success(`Published version ${layout.version}`);
		},
		// On a conflict the draft is kept, so the admin can copy anything before reloading.
		onError: (error) => toast.error(getErrorMessage(error)),
	});
}
