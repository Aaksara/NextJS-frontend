import type { Metadata } from "next";

import MyListingsView from "@/features/student/components/MyListingsView";

export const metadata: Metadata = { title: "My listings" };

export default function MyListingsPage() {
	return <MyListingsView />;
}
