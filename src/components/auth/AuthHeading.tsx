import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

interface AuthHeadingProps {
	title: string;
	description?: ReactNode;
	/** Short label in a badge above the title, e.g. "Student access". */
	eyebrow?: string;
	/** Shown in a circle above the title. Centers the heading. */
	icon?: ReactNode;
}

export default function AuthHeading({ title, description, eyebrow, icon }: AuthHeadingProps) {
	return (
		<div className={cn("mb-6 flex flex-col gap-2", icon && "items-center text-center")}>
			{icon && (
				<div className="mb-2 flex size-16 items-center justify-center rounded-full bg-primary-container text-primary-container-foreground [&_svg]:size-7">
					{icon}
				</div>
			)}
			{eyebrow && <Badge className="mb-1">{eyebrow}</Badge>}
			<Text as="h1" variant="headline-md" tone="primary" className="lg:text-headline-lg">
				{title}
			</Text>
			{description && <Text tone="muted">{description}</Text>}
		</div>
	);
}
