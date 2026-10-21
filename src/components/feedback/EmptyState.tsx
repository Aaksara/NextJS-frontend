import { type LucideIcon, SearchX } from "lucide-react";

import { Text } from "@/components/ui/typography";

interface EmptyStateProps {
	title: string;
	hint: string;
	icon?: LucideIcon;
}

export default function EmptyState({ title, hint, icon: Icon = SearchX }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
			<Icon aria-hidden className="size-6 text-muted-foreground" />
			<Text variant="label-lg">{title}</Text>
			<Text variant="body-sm" tone="muted">
				{hint}
			</Text>
		</div>
	);
}
