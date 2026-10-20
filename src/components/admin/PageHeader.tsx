import type { ReactNode } from "react";

import { Text } from "@/components/ui/typography";

interface PageHeaderProps {
	title: string;
	description: string;
	/** Buttons on the right. */
	actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div className="space-y-1">
				<Text as="h1" variant="headline-lg" className="text-primary">
					{title}
				</Text>
				<Text tone="muted" className="max-w-2xl">
					{description}
				</Text>
			</div>
			{actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
		</header>
	);
}
