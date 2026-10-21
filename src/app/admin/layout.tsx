import type { Metadata } from "next";
import type { ReactNode } from "react";

import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
	title: { default: "Admin", template: "%s · Akshara Admin" },
	robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
	return <QueryProvider>{children}</QueryProvider>;
}
