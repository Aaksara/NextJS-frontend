import Link from "next/link";

import Brand from "@/components/layout/Brand";
import Container from "@/components/layout/Container";
import { Text } from "@/components/ui/typography";

const columns = [
	{
		title: "Explore",
		links: [
			{ href: "#how-it-works", label: "How it works" },
			{ href: "#sell-swap-donate", label: "Sell, swap, donate" },
			{ href: "#safety", label: "Safety" },
		],
	},
	{
		title: "Account",
		links: [
			{ href: "/login", label: "Sign in" },
			{ href: "/register", label: "Create an account" },
		],
	},
];

export default function LandingFooter() {
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
