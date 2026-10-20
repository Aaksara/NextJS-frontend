import { Text } from "@/components/ui/typography";
import PlatformHealth from "@/features/admin/platform/components/PlatformHealth";

import AdminBrand from "./AdminBrand";
import ConsoleNav from "./ConsoleNav";

export default function Sidebar() {
	return (
		<aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r bg-card px-4 py-6 lg:flex">
			<div className="px-2">
				<AdminBrand />
			</div>
			<div className="flex-1 space-y-2">
				<Text
					as="span"
					variant="label-sm"
					tone="muted"
					className="block px-3 uppercase tracking-wider"
				>
					Console management
				</Text>
				<ConsoleNav orientation="vertical" />
			</div>
			<PlatformHealth />
		</aside>
	);
}
