import type { Metadata } from "next";

import CampusView from "@/features/admin/campus/components/CampusView";

export const metadata: Metadata = { title: "Campus settings" };

export default function CampusPage() {
	return <CampusView />;
}
