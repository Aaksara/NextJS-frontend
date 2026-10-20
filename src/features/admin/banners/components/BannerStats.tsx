import { FilePen, GalleryHorizontal, Megaphone, MonitorCheck } from "lucide-react";

import StatCard from "@/components/admin/StatCard";

import type { Banner } from "../types";

export default function BannerStats({ banners }: { banners: readonly Banner[] }) {
	const published = banners.filter((banner) => banner.status === "published");
	const livePlacement = (placement: Banner["placement"]) =>
		published.filter((banner) => banner.placement === placement).length;

	return (
		<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
			<StatCard label="Published" value={published.length} icon={MonitorCheck} tone="success" />
			<StatCard
				label="Live hero slides"
				value={livePlacement("hero")}
				icon={GalleryHorizontal}
				tone="tertiary"
			/>
			<StatCard
				label="Live promotions"
				value={livePlacement("promotion")}
				icon={Megaphone}
				tone="secondary"
			/>
			<StatCard label="Drafts" value={banners.length - published.length} icon={FilePen} />
		</div>
	);
}
