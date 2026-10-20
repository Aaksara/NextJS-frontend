import type { Metadata } from "next";

import BannersView from "@/features/admin/banners/components/BannersView";

export const metadata: Metadata = { title: "Sliders and banners" };

export default function BannersPage() {
	return <BannersView />;
}
