import { cn } from "@/lib/utils/utils";

interface FilterChip<T extends string> {
	value: T;
	label: string;
	/** Shown after the label, e.g. how many items the filter matches. */
	count?: number;
}

interface FilterChipsProps<T extends string> {
	/** Accessible name of the group, e.g. "Listing type". */
	label: string;
	options: FilterChip<T>[];
	value: T;
	onChange: (value: T) => void;
	className?: string;
}

/** A row of pill buttons, of which exactly one is selected. */
function FilterChips<T extends string>({
	label,
	options,
	value,
	onChange,
	className,
}: FilterChipsProps<T>) {
	return (
		<fieldset aria-label={label} className={cn("flex min-w-0 flex-wrap gap-2", className)}>
			{options.map((option) => {
				const selected = option.value === value;
				return (
					<button
						key={option.value}
						type="button"
						aria-pressed={selected}
						onClick={() => onChange(option.value)}
						className={cn(
							"inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-label-md outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
							selected
								? "border-primary bg-primary text-primary-foreground"
								: "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						{option.label}
						{option.count !== undefined && (
							<span
								className={cn(
									"min-w-5 rounded-full px-1.5 text-center text-label-sm tabular-nums",
									selected ? "bg-primary-foreground/20" : "bg-muted",
								)}
							>
								{option.count}
							</span>
						)}
					</button>
				);
			})}
		</fieldset>
	);
}

export { type FilterChip, FilterChips };
