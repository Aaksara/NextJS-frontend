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
			},
		},
		defaultVariants: { tone: "primary" },
	},
);

function Badge({
	tone,
	className,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge };
