import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

const iconTones = {
	primary: "bg-primary-container text-primary-container-foreground",
	secondary: "bg-secondary-container text-secondary-container-foreground",
	tertiary: "bg-tertiary-container text-tertiary-container-foreground",
	success: "bg-success-container text-success-container-foreground",
};

interface StatCardProps {
	label: string;
	value: ReactNode;
	icon: LucideIcon;
	tone?: keyof typeof iconTones;
	/** Small line under the value, e.g. a trend. */
	footnote?: ReactNode;
}

export default function StatCard({
	label,
	value,
	icon: Icon,
	tone = "primary",
	footnote,
}: StatCardProps) {
	return (
		<div className="flex items-start justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm">
			<dl className="min-w-0 space-y-1">
				<Text as="dt" variant="label-sm" tone="muted" className="uppercase tracking-wider">
					{label}
				</Text>
				<Text as="dd" variant="headline-lg" className="text-primary tabular-nums">
					{value}
				</Text>
				{footnote && (
					<Text as="dd" variant="body-sm" tone="muted">
						{footnote}
					</Text>
				)}
			</dl>
			<span
				aria-hidden
				className={cn(
					"flex size-10 shrink-0 items-center justify-center rounded-lg",
					iconTones[tone],
				)}
			>
				<Icon className="size-5" />
			</span>
		</div>
	);
}
