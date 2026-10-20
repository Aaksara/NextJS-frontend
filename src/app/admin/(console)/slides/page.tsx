import type { Metadata } from "next";

import SlidesView from "@/features/admin/slides/components/SlidesView";

export const metadata: Metadata = { title: "Homepage slides" };

export default function SlidesPage() {
	return <SlidesView />;
}
