import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils/utils";

const toneVariants = cva("", {
	variants: {
		tone: {
			primary: "bg-primary",
			secondary: "bg-secondary",
			tertiary: "bg-tertiary",
			destructive: "bg-destructive",
		},
	},
	defaultVariants: { tone: "primary" },
});

type ToneProps = VariantProps<typeof toneVariants>;
type BarProps = Omit<React.ComponentProps<"div">, "children"> & ToneProps;

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);

/** Continuous bar. `value` is a percentage from 0 to 100. */
function Progress({ value, tone, className, ...props }: BarProps & { value: number }) {
	const percent = clamp(value, 100);
	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={percent}
			className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
			{...props}
		>
			<div
				className={cn("h-full rounded-full transition-[width]", toneVariants({ tone }))}
				style={{ width: `${percent}%` }}
			/>
		</div>
	);
}

/** Bar split into `steps` equal segments, the first `value` of them filled. */
function SegmentedProgress({
	steps,
	value,
	tone,
	className,
	...props
}: BarProps & { steps: number; value: number }) {
	const filled = clamp(value, steps);
	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={steps}
			aria-valuenow={filled}
			className={cn("flex gap-1.5", className)}
			{...props}
		>
			{Array.from({ length: steps }, (_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: segments are identical and never reorder.
					key={i}
					className={cn(
						"h-1.5 flex-1 rounded-full transition-colors",
						i < filled ? toneVariants({ tone }) : "bg-muted",
					)}
				/>
			))}
		</div>
	);
}

export { Progress, SegmentedProgress };
