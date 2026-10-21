import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ListingDetailView from "@/features/browse/components/ListingDetailView";

export const metadata: Metadata = { title: "Book details" };

export default async function ListingPage({ params }: PageProps<"/browse/[id]">) {
	const id = Number((await params).id);
	if (!Number.isInteger(id) || id < 1) notFound();
	return <ListingDetailView id={id} />;
}
