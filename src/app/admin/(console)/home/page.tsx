import type { Metadata } from "next";

import HomeSectionsView from "@/features/admin/home-sections/components/HomeSectionsView";

export const metadata: Metadata = { title: "Home page sections" };

export default function HomeSectionsPage() {
	return <HomeSectionsView />;
}
