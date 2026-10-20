"use client";

import { GripVertical, Plus } from "lucide-react";
import { useState } from "react";

import EmptyState from "@/components/admin/EmptyState";
import PageHeader from "@/components/admin/PageHeader";
import QueryState from "@/components/admin/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/typography";
import { moveById } from "@/lib/utils/reorder";

import { filterBanners, type PlacementFilter } from "../filters";
import { useBanners, useReorderBanners } from "../queries";
import type { Banner } from "../types";
import BannerFormDialog from "./BannerFormDialog";
import BannerStats from "./BannerStats";
import BannerTable from "./BannerTable";

const placementFilters = [
	{ value: "all", label: "All banners" },
	{ value: "hero", label: "Hero carousel" },
	{ value: "promotion", label: "Promotions" },
	{ value: "footer", label: "Footer notices" },
] as const;

/** Which banner the form dialog is open for. */
type Editing = { banner?: Banner } | null;

export default function BannersView() {
	const query = useBanners();
	const reorder = useReorderBanners();
	const [placement, setPlacement] = useState<PlacementFilter>("all");
	const [search, setSearch] = useState("");
	const [editing, setEditing] = useState<Editing>(null);

	const banners = query.data ?? [];
	const visible = filterBanners(banners, { placement, search });
	const isFiltered = placement !== "all" || search.trim() !== "";

	return (
		<>
			<PageHeader
				trail={["Marketing", "Storefront banners"]}
				title="Sliders and banners"
				description="Hero slides, promotions and footer notices for the storefront. Only published banners are shown to students."
				actions={
					<>
						<SearchInput
							placeholder="Search by title or link"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							className="w-64 bg-card"
						/>
						<Button onClick={() => setEditing({})}>
							<Plus />
							New banner
						</Button>
					</>
				}
			/>

			<BannerStats banners={banners} />

			<Card className="gap-0 overflow-hidden py-0">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
					<SegmentedControl
						label="Placement"
						options={placementFilters}
						value={placement}
						onValueChange={setPlacement}
					/>
					<Text variant="body-sm" tone="muted" className="flex items-center gap-1">
						<GripVertical aria-hidden className="size-4" />
						{isFiltered
							? "Clear the filters to change the order"
							: "Drag rows to change the display order"}
					</Text>
				</div>

				<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
				{query.isSuccess &&
					(visible.length === 0 ? (
						<EmptyState
							title={banners.length ? "No banners match" : "No banners yet"}
							hint={
								banners.length
									? "Try another placement or search."
									: "Create one with New banner. It stays a draft until you publish it."
							}
						/>
					) : (
						<BannerTable
							banners={visible}
							canReorder={!isFiltered}
							onEdit={(banner) => setEditing({ banner })}
							onMove={(fromId, toId) => reorder.mutate(moveById(banners, fromId, toId))}
						/>
					))}
			</Card>

			<BannerFormDialog
				open={editing !== null}
				onClose={() => setEditing(null)}
				banner={editing?.banner}
			/>
		</>
	);
}
