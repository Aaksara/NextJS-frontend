"use client";

import { ArrowDown, ArrowUp, PenLine } from "lucide-react";
import { useEffect, useState } from "react";

import PageHeader from "@/components/admin/PageHeader";
import QueryState from "@/components/admin/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
import { moveItem } from "@/lib/utils/reorder";
import { cn } from "@/lib/utils/utils";
import type { HomeSectionKind } from "@/services/cms.service";

import { sectionInfo } from "../constants";
import { hasCustomContent } from "../content-form";
import { useHomeSections, useSaveHomeSections } from "../queries";
import type { HomeSection, HomeSectionLayout } from "../types";
import SectionContentDialog from "./SectionContentDialog";

const toLayout = (sections: HomeSection[]): HomeSectionLayout[] =>
	sections.map(({ kind, is_enabled }) => ({ kind, is_enabled }));

/**
 * Edits a copy of the saved order and visibility. Mount with a fresh `key` after each save;
 * text edits save on their own and leave unsaved order changes alone.
 */
function SectionEditor({ sections: savedSections }: { sections: HomeSection[] }) {
	const saved = toLayout(savedSections);
	const [sections, setSections] = useState(saved);
	const [editing, setEditing] = useState<HomeSectionKind | null>(null);
	const save = useSaveHomeSections();
	const hasChanges = JSON.stringify(sections) !== JSON.stringify(saved);
	const editingSection = savedSections.find((section) => section.kind === editing);
	const customKinds = new Set(savedSections.filter(hasCustomContent).map(({ kind }) => kind));

	// Warn before closing the tab with unsaved changes.
	useEffect(() => {
		if (!hasChanges) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [hasChanges]);

	function setEnabled(index: number, is_enabled: boolean) {
		setSections((current) =>
			current.map((section, i) => (i === index ? { ...section, is_enabled } : section)),
		);
	}

	return (
		<Card className="gap-0 overflow-hidden py-0">
			<ol className="divide-y">
				{sections.map((section, index) => {
					const { label, description } = sectionInfo[section.kind];
					return (
						<li
							key={section.kind}
							className={cn(
								"flex flex-wrap items-center gap-x-4 gap-y-3 p-4",
								!section.is_enabled && "bg-muted/50",
							)}
						>
							<div className="flex flex-col">
								<IconButton
									variant="ghost"
									size="icon-sm"
									label={`Move ${label} up`}
									disabled={index === 0}
									onClick={() => setSections(moveItem(sections, index, index - 1))}
								>
									<ArrowUp />
								</IconButton>
								<IconButton
									variant="ghost"
									size="icon-sm"
									label={`Move ${label} down`}
									disabled={index === sections.length - 1}
									onClick={() => setSections(moveItem(sections, index, index + 1))}
								>
									<ArrowDown />
								</IconButton>
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<Text variant="label-lg" tone={section.is_enabled ? undefined : "muted"}>
										{label}
									</Text>
									{customKinds.has(section.kind) && (
										<Badge tone="secondary" size="sm">
											Custom text
										</Badge>
									)}
								</div>
								<Text variant="body-sm" tone="muted">
									{description}
								</Text>
							</div>
							{/* Wraps under the label on narrow screens. */}
							<div className="ml-auto flex items-center gap-4">
								<Button variant="outlined" size="sm" onClick={() => setEditing(section.kind)}>
									<PenLine />
									Edit text
								</Button>
								<Switch
									checked={section.is_enabled}
									onCheckedChange={(is_enabled) => setEnabled(index, is_enabled)}
									label={`Show ${label}`}
								/>
								<Text as="span" variant="body-sm" tone="muted" className="w-14">
									{section.is_enabled ? "Shown" : "Hidden"}
								</Text>
							</div>
						</li>
					);
				})}
			</ol>
			<div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/40 px-4 py-3">
				<Text variant="body-sm" tone="muted" role="status">
					{hasChanges ? "You have unsaved changes." : "The site header and footer always show."}
				</Text>
				<div className="flex gap-2">
					<Button
						variant="ghost"
						onClick={() => setSections(saved)}
						disabled={!hasChanges || save.isPending}
					>
						Discard
					</Button>
					<Button onClick={() => save.mutate(sections)} disabled={!hasChanges || save.isPending}>
						{save.isPending ? "Saving…" : "Save"}
					</Button>
				</div>
			</div>

			{editingSection && (
				<SectionContentDialog section={editingSection} onClose={() => setEditing(null)} />
			)}
		</Card>
	);
}

export default function HomeSectionsView() {
	const query = useHomeSections();

	return (
		<>
			<PageHeader
				title="Home page sections"
				description="Choose which sections the home page shows, in what order, and what they say."
			/>
			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.data && (
				<SectionEditor key={JSON.stringify(toLayout(query.data))} sections={query.data} />
			)}
		</>
	);
}
