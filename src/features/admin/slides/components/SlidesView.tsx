"use client";

import { ArrowDown, ArrowUp, Link2, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import PageHeader from "@/components/admin/PageHeader";
import QueryState from "@/components/admin/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
import { moveItem } from "@/lib/utils/reorder";
import type { SliderKey } from "@/services/cms.service";

import { sliders } from "../constants";
import { useAddDefaultSlides, usePublishSlide, useReorderSlides, useSlides } from "../queries";
import type { Slide } from "../types";
import SlideFormDialog from "./SlideFormDialog";

/** Which slide the form is open for, or which slider a new one goes to. */
type Editing = { slider: SliderKey; slide?: Slide } | null;

interface SliderCardProps {
	label: string;
	description: string;
	slides: Slide[];
	onAdd: () => void;
	onAddDefaults: () => void;
	onEdit: (slide: Slide) => void;
	onMove: (ordered: Slide[]) => void;
	onPublish: (slide: Slide, is_published: boolean) => void;
	busy: boolean;
}

/** One slider's slides, in order, with their controls. */
function SliderCard({
	label,
	description,
	slides,
	onAdd,
	onAddDefaults,
	onEdit,
	onMove,
	onPublish,
	busy,
}: SliderCardProps) {
	return (
		<Card className="gap-0 overflow-hidden py-0">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
				<div className="space-y-0.5">
					<Text as="h2" variant="label-lg">
						{label}
					</Text>
					<Text variant="body-sm" tone="muted">
						{description}
					</Text>
				</div>
				<Button variant="outlined" size="sm" onClick={onAdd}>
					<Plus />
					Add slide
				</Button>
			</div>
			{slides.length === 0 ? (
				<div className="flex flex-wrap items-center justify-between gap-3 p-4">
					<Text variant="body-sm" tone="muted">
						No slides yet, so the site shows its built-in pictures here.
					</Text>
					<Button variant="secondary" size="sm" onClick={onAddDefaults} disabled={busy}>
						Add the built-in slides to edit
					</Button>
				</div>
			) : (
				<ol className="divide-y">
					{slides.map((slide, index) => (
						<li key={slide.id} className="flex flex-wrap items-center gap-4 p-4">
							<div className="flex flex-col">
								<IconButton
									variant="ghost"
									size="icon-sm"
									label={`Move "${slide.caption}" up`}
									disabled={index === 0 || busy}
									onClick={() => onMove(moveItem(slides, index, index - 1))}
								>
									<ArrowUp />
								</IconButton>
								<IconButton
									variant="ghost"
									size="icon-sm"
									label={`Move "${slide.caption}" down`}
									disabled={index === slides.length - 1 || busy}
									onClick={() => onMove(moveItem(slides, index, index + 1))}
								>
									<ArrowDown />
								</IconButton>
							</div>
							<div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
								<Image
									src={slide.image}
									alt={slide.alt_text}
									fill
									unoptimized
									sizes="112px"
									className="object-cover"
								/>
							</div>
							<div className="min-w-48 flex-1 space-y-1">
								<Text variant="label-lg">{slide.caption}</Text>
								{slide.link && (
									<a
										href={slide.link}
										target="_blank"
										rel="noreferrer"
										className="flex items-center gap-1 text-body-sm text-muted-foreground hover:text-primary"
									>
										<Link2 aria-hidden className="size-3.5 shrink-0" />
										<span className="truncate">{slide.link}</span>
									</a>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Switch
									checked={slide.is_published}
									onCheckedChange={(is_published) => onPublish(slide, is_published)}
									disabled={busy}
									label={`Show "${slide.caption}" on the site`}
								/>
								<Text as="span" variant="body-sm" tone="muted" className="w-14">
									{slide.is_published ? "Shown" : "Hidden"}
								</Text>
								<IconButton
									variant="ghost"
									size="icon-sm"
									label={`Edit "${slide.caption}"`}
									onClick={() => onEdit(slide)}
								>
									<Pencil />
								</IconButton>
							</div>
						</li>
					))}
				</ol>
			)}
		</Card>
	);
}

export default function SlidesView() {
	const query = useSlides();
	const publish = usePublishSlide();
	const reorder = useReorderSlides();
	const addDefaults = useAddDefaultSlides();
	const [editing, setEditing] = useState<Editing>(null);
	const busy = publish.isPending || reorder.isPending || addDefaults.isPending;

	return (
		<>
			<PageHeader
				title="Slides"
				description="Every slider on the site, with its own pictures. A slider with no shown slides uses its built-in pictures."
			/>

			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.data &&
				sliders.map(({ key, label, description }) => (
					<SliderCard
						key={key}
						label={label}
						description={description}
						slides={query.data.filter((slide) => slide.slider === key)}
						onAdd={() => setEditing({ slider: key })}
						onAddDefaults={() => addDefaults.mutate(key)}
						onEdit={(slide) => setEditing({ slider: key, slide })}
						onMove={(ordered) => reorder.mutate({ slider: key, ordered })}
						onPublish={(slide, is_published) => publish.mutate({ id: slide.id, is_published })}
						busy={busy}
					/>
				))}

			{editing && (
				<SlideFormDialog
					open
					onClose={() => setEditing(null)}
					slide={editing.slide}
					slider={editing.slider}
				/>
			)}
		</>
	);
}
