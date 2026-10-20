import type { Metadata } from "next";

import StorefrontView from "@/features/admin/storefront/components/StorefrontView";

export const metadata: Metadata = { title: "Component CMS" };

export default function ComponentsPage() {
	return <StorefrontView />;
}
