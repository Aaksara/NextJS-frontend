import type { Metadata } from "next";
import type { ReactNode } from "react";

import Container from "@/components/layout/Container";
import SiteFooter from "@/components/layout/SiteFooter";
import QueryProvider from "@/components/providers/QueryProvider";
import StudentGate from "@/features/student/components/StudentGate";
import StudentHeader from "@/features/student/components/StudentHeader";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function StudentLayout({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<StudentGate>
				<div className="flex min-h-screen flex-col">
					<StudentHeader />
					<main className="flex-1">
						<Container className="space-y-8 py-6 lg:py-8">{children}</Container>
					</main>
					<SiteFooter />
				</div>
			</StudentGate>
		</QueryProvider>
	);
}
