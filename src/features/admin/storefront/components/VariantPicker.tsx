import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

import { variantOptions } from "../constants";
import type { SectionVariant } from "../types";

const swatches: Record<SectionVariant, string> = {
	light: "border bg-card",
	navy: "bg-primary",
};

interface VariantPickerProps {
	value: SectionVariant;
	onChange: (variant: SectionVariant) => void;
}

export default function VariantPicker({ value, onChange }: VariantPickerProps) {
	return (
		<fieldset className="space-y-3">
			<legend className="text-label-lg">Design variant</legend>
			<div className="grid gap-3 sm:grid-cols-2">
				{Object.entries(variantOptions).map(([key, option]) => {
					const variant = key as SectionVariant;
					return (
						<label
							key={variant}
							className={cn(
								"flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-3 transition-colors",
								"has-[:checked]:border-primary has-[:checked]:bg-primary-container/30 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
							)}
						>
							<span className="flex items-center gap-2">
								<input
									type="radio"
									name="section-variant"
									value={variant}
									checked={value === variant}
									onChange={() => onChange(variant)}
									className="size-4 accent-primary"
								/>
								<Text as="span" variant="label-lg">
									{option.label}
								</Text>
							</span>
							<span
								aria-hidden
								className={cn("flex h-10 items-end gap-1 rounded-md p-2", swatches[variant])}
							>
								<span className="h-1.5 w-8 rounded-full bg-secondary-container" />
								<span className="h-1.5 w-12 rounded-full bg-current opacity-20" />
							</span>
							<Text as="span" variant="body-sm" tone="muted">
								{option.description}
							</Text>
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}
