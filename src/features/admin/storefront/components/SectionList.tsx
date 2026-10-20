"use client";

import { GripVertical } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
import { useDragReorder } from "@/hooks/use-drag-reorder";
import { cn } from "@/lib/utils/utils";

import { sectionCatalog } from "../constants";
import type { DraftSection } from "../types";

interface SectionListProps {
	sections: readonly DraftSection[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	onToggle: (id: string, enabled: boolean) => void;
	onMove: (fromId: string, toId: string) => void;
}

/** The page's sections, top to bottom. */
export default function SectionList({
	sections,
	selectedId,
	onSelect,
	onToggle,
	onMove,
}: SectionListProps) {
	const { rowProps, handleProps } = useDragReorder({ onMove });

	return (
		<ol className="space-y-2">
			{sections.map((section, index) => {
				const { icon: Icon, label } = sectionCatalog[section.kind];
				const selected = section.id === selectedId;
				return (
					<li
						key={section.id}
						{...rowProps(section.id)}
						className={cn(
							"flex items-center gap-2 rounded-xl border bg-card p-2 pr-3 transition-colors",
							"data-[dragging]:opacity-50 data-[drop-target]:border-primary",
							selected && "border-primary ring-2 ring-primary/20",
							!section.is_enabled && "bg-muted/50",
						)}
					>
						<button
							type="button"
							aria-label={`Reorder ${section.display_title}. Use the arrow keys to move it.`}
							className="cursor-grab rounded p-1 text-muted-foreground outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 active:cursor-grabbing"
							{...handleProps(section.id, {
								previous: sections[index - 1]?.id,
								next: sections[index + 1]?.id,
							})}
						>
							<GripVertical aria-hidden className="size-4" />
						</button>
						<button
							type="button"
							aria-pressed={selected}
							onClick={() => onSelect(section.id)}
							className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
						>
							<span
								aria-hidden
								className={cn(
									"flex size-9 shrink-0 items-center justify-center rounded-lg",
									selected
										? "bg-primary text-primary-foreground"
										: "bg-primary-container text-primary-container-foreground",
								)}
							>
								<Icon className="size-4" />
							</span>
							<span className="min-w-0">
								<Text as="span" variant="label-lg" className="block truncate">
									{section.display_title || "Untitled section"}
								</Text>
								<Text as="span" variant="body-sm" tone="muted" className="block truncate">
									{label} · #{section.anchor_id}
								</Text>
							</span>
						</button>
						<Switch
							checked={section.is_enabled}
							onCheckedChange={(enabled) => onToggle(section.id, enabled)}
							label={`Show ${section.display_title}`}
						/>
					</li>
				);
			})}
		</ol>
	);
}
