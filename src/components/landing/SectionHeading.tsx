import type { ReactNode } from "react";

import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

interface SectionHeadingProps {
	eyebrow: string;
	title: ReactNode;
	description?: string;
	align?: "start" | "center";
	className?: string;
}

export default function SectionHeading({
	eyebrow,
	title,
	description,
	align = "start",
	className,
}: SectionHeadingProps) {
	return (
		<div className={cn("space-y-3", align === "center" && "mx-auto text-center", className)}>
			<Text variant="label-sm" className="uppercase tracking-widest text-secondary">
				{eyebrow}
			</Text>
			<Text as="h2" variant="headline-lg" tone="primary" className="sm:text-display-md">
				{title}
			</Text>
			{description && (
				<Text
					variant="body-lg"
					tone="muted"
					className={cn("max-w-xl", align === "center" && "mx-auto")}
				>
					{description}
				</Text>
			)}
		</div>
	);
}
