import { Eye } from "lucide-react";

import Field from "@/components/form/Field";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Text } from "@/components/ui/typography";

import { toAnchorId } from "../anchor";
import { sectionCatalog } from "../constants";
import type { DraftSection, SectionKind } from "../types";
import SectionPreview from "./SectionPreview";
import VariantPicker from "./VariantPicker";

interface SectionInspectorProps {
	section: DraftSection;
	onChange: (changes: Partial<DraftSection>) => void;
}

/** Settings and live preview for the selected section. */
export default function SectionInspector({ section, onChange }: SectionInspectorProps) {
	const catalog = sectionCatalog[section.kind];

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="space-y-1">
					<Text variant="label-sm" tone="muted" className="uppercase tracking-wider">
						Inspector
					</Text>
					<Text as="h2" variant="headline-sm" className="text-primary">
						{catalog.label}
					</Text>
					<Text variant="body-sm" tone="muted">
						{catalog.description}
					</Text>
				</div>
				<Badge tone={section.is_enabled ? "success" : "neutral"} dot>
					{section.is_enabled ? "Visible" : "Hidden"}
				</Badge>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field htmlFor="section-kind" label="Component type" className="sm:col-span-2">
					<Select
						id="section-kind"
						value={section.kind}
						onChange={(event) => onChange({ kind: event.target.value as SectionKind })}
					>
						{Object.entries(sectionCatalog).map(([kind, { label }]) => (
							<option key={kind} value={kind}>
								{label}
							</option>
						))}
					</Select>
				</Field>
				<Field htmlFor="section-title" label="Display title">
					<Input
						id="section-title"
						value={section.display_title}
						maxLength={120}
						onChange={(event) => onChange({ display_title: event.target.value })}
					/>
				</Field>
				<Field htmlFor="section-anchor" label="Anchor ID" hint="Letters, numbers and hyphens.">
					<Input
						id="section-anchor"
						value={section.anchor_id}
						maxLength={60}
						onChange={(event) => onChange({ anchor_id: toAnchorId(event.target.value, true) })}
						className="font-mono"
					/>
				</Field>
			</div>

			<section aria-label="Preview" className="space-y-2">
				<Text variant="label-md" tone="muted" className="flex items-center gap-1.5">
					<Eye aria-hidden className="size-4" />
					Preview
				</Text>
				<SectionPreview
					kind={section.kind}
					variant={section.variant}
					title={section.display_title}
				/>
			</section>

			<VariantPicker value={section.variant} onChange={(variant) => onChange({ variant })} />
		</div>
	);
}
