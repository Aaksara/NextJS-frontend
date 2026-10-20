"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";

import PageHeader from "@/components/admin/PageHeader";
import QueryState from "@/components/admin/QueryState";
import { SegmentedControl } from "@/components/ui/segmented-control";

import { platformLabels } from "../constants";
import { useStorefrontLayout } from "../queries";
import type { Platform } from "../types";
import LayoutEditor from "./LayoutEditor";

const platformOptions = [
	{
		value: "web",
		label: (
			<>
				<Monitor aria-hidden />
				{platformLabels.web}
			</>
		),
	},
	{
		value: "mobile",
		label: (
			<>
				<Smartphone aria-hidden />
				{platformLabels.mobile}
			</>
		),
	},
] as const;

function PlatformLayout({ platform, hidden }: { platform: Platform; hidden: boolean }) {
	const query = useStorefrontLayout(platform);
	return (
		<div hidden={hidden}>
			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.data && <LayoutEditor key={query.data.version} layout={query.data} />}
		</div>
	);
}

export default function StorefrontView() {
	const [platform, setPlatform] = useState<Platform>("web");

	return (
		<>
			<PageHeader
				trail={["Layout", "Home page"]}
				title="Website and app components"
				description="Order, show and restyle the sections of the storefront home page. Changes stay in draft until you publish."
				actions={
					<SegmentedControl
						label="Platform"
						options={platformOptions}
						value={platform}
						onValueChange={setPlatform}
					/>
				}
			/>
			{/* Both editors stay mounted, so switching platform keeps each one's draft. */}
			{(["web", "mobile"] as const).map((key) => (
				<PlatformLayout key={key} platform={key} hidden={key !== platform} />
			))}
		</>
	);
}
