import type { ReactNode } from "react";

import AdminGate from "@/components/admin/AdminGate";
import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
	return (
		<AdminGate>
			<div className="flex min-h-screen">
				<Sidebar />
				<div className="flex min-w-0 flex-1 flex-col">
					<TopBar />
					<main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
						{children}
					</main>
				</div>
			</div>
		</AdminGate>
	);
}
