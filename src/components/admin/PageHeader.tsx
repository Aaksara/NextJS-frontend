import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { Text } from "@/components/ui/typography";

interface PageHeaderProps {
	/** Breadcrumb trail above the title, e.g. ["Marketing", "Campus feeds"]. */
	trail: string[];
	title: string;
	description: string;
	/** Buttons and inputs on the right. */
	actions?: ReactNode;
}

export default function PageHeader({ trail, title, description, actions }: PageHeaderProps) {
	return (
		<header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div className="space-y-2">
				<ol aria-label="Breadcrumb" className="flex items-center gap-1 text-label-sm">
					{trail.map((crumb, index) => (
						<li key={crumb} className="flex items-center gap-1">
							{index > 0 && <ChevronRight aria-hidden className="size-3 text-muted-foreground" />}
							<span
								className={
									index === 0 ? "text-secondary uppercase tracking-wider" : "text-muted-foreground"
								}
							>
								{crumb}
							</span>
						</li>
					))}
				</ol>
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
