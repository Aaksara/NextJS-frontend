import Link from "next/link";

import HeaderActions from "@/components/landing/HeaderActions";
import Brand from "@/components/layout/Brand";
import Container from "@/components/layout/Container";
import { textVariants } from "@/components/ui/typography";

const links = [
	{ href: "#how-it-works", label: "How it works" },
	{ href: "#sell-swap-donate", label: "Sell, swap, donate" },
	{ href: "#safety", label: "Safety" },
];

export default function LandingHeader() {
	return (
		<header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur">
			{/* On phones the section links wrap onto a second row under the logo. */}
			<Container className="flex flex-wrap items-center justify-between gap-x-6 py-3 md:h-16 md:flex-nowrap md:py-0">
				<Brand />
				<nav aria-label="Sections" className="order-last w-full md:order-none md:w-auto">
					<ul className="flex items-center gap-6 overflow-x-auto pt-2 md:gap-8 md:pt-0">
						{links.map(({ href, label }) => (
							<li key={href} className="shrink-0">
								<Link
									href={href}
									className={textVariants({
										variant: "label-md",
										className: "text-muted-foreground transition-colors hover:text-primary",
									})}
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<HeaderActions />
			</Container>
		</header>
	);
}
