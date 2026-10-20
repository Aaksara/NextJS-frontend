"use client";

import { ArrowDown, ArrowUp, Link2, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import EmptyState from "@/components/admin/EmptyState";
import PageHeader from "@/components/admin/PageHeader";
import QueryState from "@/components/admin/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
import { moveItem } from "@/lib/utils/reorder";

import { usePublishSlide, useReorderSlides, useSlides } from "../queries";
import type { Slide } from "../types";
import SlideFormDialog from "./SlideFormDialog";

/** Which slide the form is open for. */
type Editing = { slide?: Slide } | null;

export default function SlidesView() {
	const query = useSlides();
	const publish = usePublishSlide();
	const reorder = useReorderSlides();
	const [editing, setEditing] = useState<Editing>(null);
	const slides = query.data ?? [];
	const busy = publish.isPending || reorder.isPending;

	return (
		<>
			<PageHeader
				title="Homepage slides"
				description="The pictures in the slider at the top of the home page. When none are shown, the built-in pictures are used."
				actions={
					<Button onClick={() => setEditing({})}>
						<Plus />
						Add slide
					</Button>
				}
			/>

			<Card className="gap-0 overflow-hidden py-0">
				<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
				{query.isSuccess &&
					(slides.length === 0 ? (
						<EmptyState title="No slides yet" hint="Add one to replace the built-in pictures." />
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
											onClick={() => reorder.mutate(moveItem(slides, index, index - 1))}
										>
											<ArrowUp />
										</IconButton>
										<IconButton
											variant="ghost"
											size="icon-sm"
											label={`Move "${slide.caption}" down`}
											disabled={index === slides.length - 1 || busy}
											onClick={() => reorder.mutate(moveItem(slides, index, index + 1))}
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
											onCheckedChange={(is_published) =>
												publish.mutate({ id: slide.id, is_published })
											}
											disabled={busy}
											label={`Show "${slide.caption}" on the home page`}
										/>
										<Text as="span" variant="body-sm" tone="muted" className="w-14">
											{slide.is_published ? "Shown" : "Hidden"}
										</Text>
										<IconButton
											variant="ghost"
											size="icon-sm"
											label={`Edit "${slide.caption}"`}
											onClick={() => setEditing({ slide })}
										>
											<Pencil />
										</IconButton>
									</div>
								</li>
							))}
						</ol>
					))}
			</Card>

			<SlideFormDialog
				open={editing !== null}
				onClose={() => setEditing(null)}
				slide={editing?.slide}
			/>
		</>
	);
}
