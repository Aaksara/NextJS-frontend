import Link from "next/link";

import HeaderActions from "@/components/landing/HeaderActions";
import MobileMenu from "@/components/landing/MobileMenu";
import { linksTo } from "@/components/landing/section-links";
import Brand from "@/components/layout/Brand";
import Container from "@/components/layout/Container";
import { textVariants } from "@/components/ui/typography";
import type { HomeSectionKind } from "@/services/cms.service";

export default function LandingHeader({
	visibleSections,
}: {
	visibleSections: readonly HomeSectionKind[];
}) {
	const links = linksTo(visibleSections);
	return (
		<header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur">
			<Container className="flex h-16 items-center justify-between gap-6">
				<Brand />
				<nav aria-label="Sections" className="hidden md:block">
					<ul className="flex items-center gap-8">
						{links.map(({ href, label }) => (
							<li key={href}>
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
				<HeaderActions className="hidden md:flex" />
				<MobileMenu links={links} className="md:hidden" />
			</Container>
		</header>
	);
}
