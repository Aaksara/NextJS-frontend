import type { Metadata } from "next";

import SlidesView from "@/features/admin/slides/components/SlidesView";

export const metadata: Metadata = { title: "Slides" };

export default function SlidesPage() {
	return <SlidesView />;
}
