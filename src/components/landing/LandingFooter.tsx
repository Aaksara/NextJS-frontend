import Link from "next/link";

import { linksTo } from "@/components/landing/section-links";
import Brand from "@/components/layout/Brand";
import Container from "@/components/layout/Container";
import { Text } from "@/components/ui/typography";
import type { HomeSectionKind } from "@/services/cms.service";

const accountLinks = [
	{ href: "/login", label: "Sign in" },
	{ href: "/register", label: "Create an account" },
];

export default function LandingFooter({
	visibleSections,
}: {
	visibleSections: readonly HomeSectionKind[];
}) {
	const columns = [
		{ title: "Explore", links: linksTo(visibleSections) },
		{ title: "Account", links: accountLinks },
	].filter((column) => column.links.length > 0);

	return (
		<footer className="border-t bg-card">
			<Container className="py-12">
				<div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
					<div className="space-y-3">
						<Brand />
						<Text variant="body-sm" tone="muted" className="max-w-xs">
							Buy, swap and donate textbooks with students at your university.
						</Text>
					</div>

					{columns.map(({ title, links }) => (
						<nav key={title} aria-label={title}>
							<Text as="h2" variant="label-sm" className="uppercase tracking-wider">
								{title}
							</Text>
							<ul className="mt-3 space-y-2">
								{links.map(({ href, label }) => (
									<li key={href}>
										<Link
											href={href}
											className="text-body-sm text-muted-foreground transition-colors hover:text-primary"
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>

				<Text variant="body-sm" tone="muted" className="mt-10 border-t pt-6">
					© {new Date().getFullYear()} Akshara
				</Text>
			</Container>
		</footer>
	);
}
