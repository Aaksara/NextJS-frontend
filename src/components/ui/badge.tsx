import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils/utils";

const badgeVariants = cva(
	"inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-label-md [&_svg]:size-3.5 [&_svg]:shrink-0",
	{
		variants: {
			tone: {
				primary: "bg-primary-container text-primary-container-foreground",
				secondary: "bg-secondary-container text-secondary-container-foreground",
				neutral: "bg-muted text-muted-foreground",
				success: "bg-success-container text-success-container-foreground",
				warning: "bg-warning-container text-warning-container-foreground",
				destructive: "bg-destructive-container text-destructive-container-foreground",
			},
			size: {
				md: "",
				sm: "px-2 py-0.5 text-label-sm",
			},
		},
		defaultVariants: { tone: "primary", size: "md" },
	},
);

type BadgeProps = React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		/** Leading dot in the badge color, for statuses. */
		dot?: boolean;
	};

function Badge({ tone, size, dot, className, children, ...props }: BadgeProps) {
	return (
		<span data-slot="badge" className={cn(badgeVariants({ tone, size }), className)} {...props}>
			{dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
			{children}
		</span>
	);
}

type BadgeTone = NonNullable<BadgeProps["tone"]>;

export { Badge, type BadgeTone };
