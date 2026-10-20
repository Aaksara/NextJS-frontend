import Container from "@/components/layout/Container";
import { Text } from "@/components/ui/typography";

export default function SiteFooter() {
	return (
		<footer className="border-t bg-card">
			<Container className="flex flex-col items-center gap-1 py-5 sm:flex-row sm:justify-between">
				<Text variant="body-sm" tone="muted">
					© {new Date().getFullYear()} Akshara
				</Text>
				<Text variant="body-sm" tone="muted">
					Buy, swap and donate textbooks on campus.
				</Text>
			</Container>
		</footer>
	);
}
