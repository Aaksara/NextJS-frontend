import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils/utils";

const indicatorVariants = cva("h-full rounded-full transition-[width]", {
	variants: {
		tone: {
			primary: "bg-primary",
			secondary: "bg-secondary",
			tertiary: "bg-tertiary",
		},
	},
	defaultVariants: { tone: "primary" },
});

type ProgressProps = Omit<React.ComponentProps<"div">, "children"> &
	VariantProps<typeof indicatorVariants> & {
		/** Percentage from 0 to 100. */
		value: number;
	};

function Progress({ value, tone, className, ...props }: ProgressProps) {
	const percent = Math.min(Math.max(value, 0), 100);
	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={percent}
			className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
			{...props}
		>
			<div className={indicatorVariants({ tone })} style={{ width: `${percent}%` }} />
		</div>
	);
}

export { Progress };
