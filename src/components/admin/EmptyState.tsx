import { SearchX } from "lucide-react";

import { Text } from "@/components/ui/typography";

/** Shown in place of a list when filters match nothing. */
export default function EmptyState({ title, hint }: { title: string; hint: string }) {
	return (
		<div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
			<SearchX aria-hidden className="size-6 text-muted-foreground" />
			<Text variant="label-lg">{title}</Text>
			<Text variant="body-sm" tone="muted">
				{hint}
			</Text>
		</div>
	);
}
