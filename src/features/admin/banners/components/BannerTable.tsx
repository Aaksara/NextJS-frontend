"use client";

import { GripVertical, Link2, Pencil } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { useDragReorder } from "@/hooks/use-drag-reorder";
import { formatRelativeTime } from "@/lib/utils/format";

import { placementLabels, statusMeta } from "../constants";
import type { Banner } from "../types";

interface BannerTableProps {
	banners: readonly Banner[];
	onEdit: (banner: Banner) => void;
	/** Moves `fromId` to where `toId` is. */
	onMove: (fromId: number, toId: number) => void;
	/** Reordering a filtered list would hide where rows land, so it is only offered unfiltered. */
	canReorder: boolean;
}

export default function BannerTable({ banners, onEdit, onMove, canReorder }: BannerTableProps) {
	const { rowProps, handleProps } = useDragReorder({ onMove });

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-20">#</TableHead>
					<TableHead>Image</TableHead>
					<TableHead>Title and link</TableHead>
					<TableHead>Placement</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{banners.map((banner, index) => {
					const status = statusMeta[banner.status];
					return (
						<TableRow
							key={banner.id}
							{...(canReorder ? rowProps(banner.id) : {})}
							className="data-[dragging]:opacity-50 data-[drop-target]:bg-primary-container/40"
						>
							<TableCell>
								<div className="flex items-center gap-1">
									{canReorder && (
										<button
											type="button"
											aria-label={`Reorder ${banner.title}. Use the arrow keys to move it.`}
											className="cursor-grab rounded p-1 text-muted-foreground outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 active:cursor-grabbing"
											{...handleProps(banner.id, {
												previous: banners[index - 1]?.id,
												next: banners[index + 1]?.id,
											})}
										>
											<GripVertical aria-hidden className="size-4" />
										</button>
									)}
									<Text as="span" variant="label-md" className="tabular-nums">
										{String(banner.position + 1).padStart(2, "0")}
									</Text>
								</div>
							</TableCell>
							<TableCell>
								<div className="relative h-16 w-28 overflow-hidden rounded-lg bg-muted">
									{/* Uploaded images live on the API's storage, so skip the optimiser. */}
									<Image
										src={banner.image}
										alt={banner.alt_text}
										fill
										unoptimized
										sizes="112px"
										className="object-cover"
										draggable={false}
									/>
									{banner.image_width && banner.image_height && (
										<span className="absolute right-1 bottom-1 rounded bg-neutral-10/70 px-1 text-[10px] text-white tabular-nums">
											{banner.image_width}×{banner.image_height}
										</span>
									)}
								</div>
							</TableCell>
							<TableCell className="min-w-72">
								<div className="space-y-1">
									<Text as="span" variant="label-lg" className="block">
										{banner.title}
									</Text>
									<a
										href={banner.target_url}
										target="_blank"
										rel="noreferrer"
										className="flex max-w-80 items-center gap-1 text-body-sm text-muted-foreground hover:text-primary"
									>
										<Link2 aria-hidden className="size-3.5 shrink-0" />
										<span className="truncate">{banner.target_url}</span>
									</a>
									<Text variant="body-sm" tone="muted">
										Updated {formatRelativeTime(banner.updated_at)}
									</Text>
								</div>
							</TableCell>
							<TableCell>
								<Badge tone="neutral" size="sm">
									{placementLabels[banner.placement]}
								</Badge>
							</TableCell>
							<TableCell>
								<Badge tone={status.tone} dot>
									{status.label}
								</Badge>
							</TableCell>
							<TableCell>
								<IconButton
									variant="ghost"
									size="icon-sm"
									label={`Edit ${banner.title}`}
									onClick={() => onEdit(banner)}
								>
									<Pencil />
								</IconButton>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
