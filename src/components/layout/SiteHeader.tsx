import Brand from "@/components/layout/Brand";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils/utils";

export default function SiteHeader({ className }: { className?: string }) {
	return (
		<header className={cn("border-b bg-card", className)}>
			<Container className="flex h-16 items-center">
				<Brand />
			</Container>
		</header>
	);
}
