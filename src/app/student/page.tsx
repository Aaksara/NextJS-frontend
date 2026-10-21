import type { Metadata } from "next";

import OverviewView from "@/features/student/components/OverviewView";

export const metadata: Metadata = { title: "My dashboard" };

export default function StudentOverviewPage() {
	return <OverviewView />;
}
