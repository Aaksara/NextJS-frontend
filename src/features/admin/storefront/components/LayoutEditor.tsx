"use client";

import { History, Plus, Rocket, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { formatRelativeTime } from "@/lib/utils/format";
import { moveById } from "@/lib/utils/reorder";

import { usePublishLayout } from "../queries";
import type { DraftSection, PageSection, StorefrontLayout } from "../types";
import { findLayoutProblem } from "../validation";
import AddSectionDialog from "./AddSectionDialog";
import SectionInspector from "./SectionInspector";
import SectionList from "./SectionList";

const toDraft = (section: PageSection): DraftSection => ({ ...section, id: String(section.id) });

/** Sections are plain data, so comparing their JSON is an exact change check. */
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function releaseLine({ version, published_at, published_by }: StorefrontLayout) {
	if (!published_at) return `Version ${version}`;
	const when = formatRelativeTime(published_at);
	return `Version ${version} · published ${when}${published_by ? ` by ${published_by}` : ""}`;
}

/**
 * Edits a draft of the live layout. Nothing reaches students until "Publish".
 * Mount with a `key` per version so the draft restarts after each publish.
 */
export default function LayoutEditor({ layout }: { layout: StorefrontLayout }) {
	const [live] = useState(() => layout.sections.map(toDraft));
	const [sections, setSections] = useState(live);
	const [selectedId, setSelectedId] = useState(live[0]?.id ?? null);
	const [adding, setAdding] = useState(false);
	const publish = usePublishLayout(layout.platform);

	const selected = sections.find((section) => section.id === selectedId);
	const liveSelected = live.find((section) => section.id === selectedId);
	const hasChanges = !same(sections, live);
	const problem = findLayoutProblem(sections);
	const visibleCount = sections.filter((section) => section.is_enabled).length;

	// Warn before closing the tab with unpublished changes.
	useEffect(() => {
		if (!hasChanges) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [hasChanges]);

	function updateSection(id: string, changes: Partial<DraftSection>) {
		setSections((current) =>
			current.map((section) => (section.id === id ? { ...section, ...changes } : section)),
		);
	}

	/** Puts the selected section back to its published settings, or removes it if it is new. */
	function resetSelected() {
		if (!selectedId) return;
		if (liveSelected) {
			updateSection(selectedId, liveSelected);
			return;
		}
		setSections((current) => current.filter((section) => section.id !== selectedId));
		setSelectedId(sections.find((section) => section.id !== selectedId)?.id ?? null);
	}

	function addSection(section: DraftSection) {
		setSections((current) => [...current, section]);
		setSelectedId(section.id);
	}

	return (
		<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
			<Card className="gap-4 p-4">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<Text as="h2" variant="label-lg">
							Page sections
						</Text>
						<Badge tone="neutral" size="sm">
							{visibleCount} of {sections.length} visible
						</Badge>
					</div>
					<Button variant="outlined" size="sm" onClick={() => setAdding(true)}>
						<Plus />
						Add
					</Button>
				</div>
				<Text variant="body-sm" tone="muted" className="flex items-center gap-1.5">
					<History aria-hidden className="size-4" />
					{releaseLine(layout)}
				</Text>
				<SectionList
					sections={sections}
					selectedId={selectedId}
					onSelect={setSelectedId}
					onToggle={(id, is_enabled) => updateSection(id, { is_enabled })}
					onMove={(fromId, toId) => setSections((current) => moveById(current, fromId, toId))}
				/>
				<Text variant="body-sm" tone="muted">
					Drag sections, or focus a handle and use the arrow keys, to change their order.
				</Text>
			</Card>

			<Card className="gap-0 py-0">
				<div className="p-6">
					{selected ? (
						<SectionInspector
							section={selected}
							onChange={(changes) => updateSection(selected.id, changes)}
						/>
					) : (
						<Text tone="muted">Add a section to start building the page.</Text>
					)}
				</div>
				<div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40 px-6 py-4">
					<Button
						variant="ghost"
						onClick={resetSelected}
						disabled={!selected || same(selected, liveSelected)}
					>
						<RotateCcw />
						{liveSelected || !selected ? "Reset section" : "Discard section"}
					</Button>
					<div className="flex items-center gap-3">
						{hasChanges && (
							<Text
								as="span"
								variant="body-sm"
								tone={problem ? "destructive" : "muted"}
								role="status"
							>
								{problem ?? "Unpublished changes"}
							</Text>
						)}
						<Button
							onClick={() => publish.mutate({ baseVersion: layout.version, sections })}
							disabled={!hasChanges || !!problem || publish.isPending}
						>
							<Rocket />
							{publish.isPending ? "Publishing…" : "Publish"}
						</Button>
					</div>
				</div>
			</Card>

			<AddSectionDialog open={adding} onClose={() => setAdding(false)} onAdd={addSection} />
		</div>
	);
}
