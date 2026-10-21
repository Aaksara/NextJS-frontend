import type { Metadata } from "next";
import { Suspense } from "react";

import PageHeader from "@/components/layout/PageHeader";
import BrowseView from "@/features/browse/components/BrowseView";

export const metadata: Metadata = {
	title: "Browse books",
	description: "Textbooks students are selling, swapping and giving away on campus.",
};

export default function BrowsePage() {
	return (
		<>
			<PageHeader
				title="Browse books"
				description="Textbooks students are selling, swapping and giving away on campus."
			/>
			{/* Reads its filters from the address, which is only known in the browser. */}
			<Suspense>
				<BrowseView />
			</Suspense>
		</>
	);
}
