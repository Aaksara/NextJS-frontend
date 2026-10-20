import Brand from "@/components/layout/Brand";
import Container from "@/components/layout/Container";

export default function SiteHeader() {
	return (
		<header className="border-b bg-card">
			<Container className="flex h-16 items-center">
				<Brand />
			</Container>
		</header>
	);
}
