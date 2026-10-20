import type { Metadata } from "next";
import type { ReactNode } from "react";

import AdminProviders from "@/components/admin/AdminProviders";

export const metadata: Metadata = {
	title: { default: "Admin", template: "%s · Akshara Admin" },
	// Internal tool: keep it out of search results.
	robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
	return <AdminProviders>{children}</AdminProviders>;
}
