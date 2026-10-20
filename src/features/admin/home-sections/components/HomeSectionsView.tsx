"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import PageHeader from "@/components/admin/PageHeader";
import QueryState from "@/components/admin/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
import { moveItem } from "@/lib/utils/reorder";
import { cn } from "@/lib/utils/utils";

import { sectionInfo } from "../constants";
import { useHomeSections, useSaveHomeSections } from "../queries";
import type { HomeSection } from "../types";

/** Edits a copy of the saved sections. Mount with a fresh `key` after each save. */
function SectionEditor({ saved }: { saved: HomeSection[] }) {
	const [sections, setSections] = useState(saved);
	const save = useSaveHomeSections();
	const hasChanges = JSON.stringify(sections) !== JSON.stringify(saved);

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
							className={cn("flex items-center gap-4 p-4", !section.is_enabled && "bg-muted/50")}
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
								<Text variant="label-lg" tone={section.is_enabled ? undefined : "muted"}>
									{label}
								</Text>
								<Text variant="body-sm" tone="muted">
									{description}
								</Text>
							</div>
							<Switch
								checked={section.is_enabled}
								onCheckedChange={(is_enabled) => setEnabled(index, is_enabled)}
								label={`Show ${label}`}
							/>
							<Text as="span" variant="body-sm" tone="muted" className="w-14">
								{section.is_enabled ? "Shown" : "Hidden"}
							</Text>
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
		</Card>
	);
}

export default function HomeSectionsView() {
	const query = useHomeSections();

	return (
		<>
			<PageHeader
				title="Home page sections"
				description="Choose which sections the home page shows, and in what order."
			/>
			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.data && <SectionEditor key={JSON.stringify(query.data)} saved={query.data} />}
		</>
	);
}
