import type { ReactNode } from "react";

import { cn } from "@/lib/utils/utils";

interface SegmentedOption<T extends string> {
	value: T;
	label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
	/** Accessible name for the group. */
	label: string;
	options: readonly SegmentedOption<T>[];
	value: T;
	onValueChange: (value: T) => void;
	className?: string;
}

/** A row of toggle buttons where exactly one is pressed, e.g. filter tabs. */
function SegmentedControl<T extends string>({
	label,
	options,
	value,
	onValueChange,
	className,
}: SegmentedControlProps<T>) {
	return (
		<fieldset
			className={cn("inline-flex max-w-full overflow-x-auto rounded-lg bg-muted p-1", className)}
		>
			<legend className="sr-only">{label}</legend>
			{options.map((option) => {
				const pressed = option.value === value;
				return (
					<button
						key={option.value}
						type="button"
						aria-pressed={pressed}
						onClick={() => onValueChange(option.value)}
						className={cn(
							"inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-label-md outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4",
							pressed
								? "bg-card text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{option.label}
					</button>
				);
			})}
		</fieldset>
	);
}

export { SegmentedControl };
