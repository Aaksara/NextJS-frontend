import { ArrowRight, BadgeCheck, CircleCheck } from "lucide-react";
import Link from "next/link";

import type { HomeContent } from "@/components/landing/content";
import { SignedOut } from "@/components/landing/session";
import Container from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageSlider, type Slide } from "@/components/ui/image-slider";
import { Text } from "@/components/ui/typography";

/** Shown until the admin publishes slides of their own. */
const builtInSlides: Slide[] = [
	{
		image: "/images/landing/hero-find.svg",
		alt: "A phone searching for a course code, with matching textbooks, between library shelves",
		caption: "Find the books for your course",
	},
	{
		image: "/images/landing/hero-list.svg",
		alt: "A phone showing a textbook's ISBN barcode beside a priced stack of books",
		caption: "List a book in a minute",
	},
	{
		image: "/images/landing/hero-pass-on.svg",
		alt: "One student handing a textbook to another under a graduation cap",
		caption: "Pass your textbooks on",
	},
];

interface HeroProps {
	content: HomeContent["hero"];
	slides: Slide[];
	/** Hides the "How it works" button when that section is hidden. */
	showHowItWorks: boolean;
}

export default function Hero({ content, slides, showHowItWorks }: HeroProps) {
	return (
		<section className="bg-linear-to-b from-primary-container/40 to-background">
			<Container className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
				<div className="space-y-6">
					<Badge className="border bg-card text-foreground">
						<BadgeCheck className="text-secondary" />
						<span className="uppercase tracking-wide">{content.eyebrow}</span>
					</Badge>
					<Text as="h1" variant="display-md" tone="primary" className="lg:text-display-lg">
						{content.title}
					</Text>
					<Text variant="body-lg" tone="muted" className="max-w-lg">
						{content.description}
					</Text>
					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
						<SignedOut>
							<Button asChild size="lg" className="rounded-full">
								<Link href="/register">
									Create your account
									<ArrowRight />
								</Link>
							</Button>
						</SignedOut>
						{showHowItWorks && (
							<Button asChild size="lg" variant="outlined" className="rounded-full">
								<Link href="#how-it-works">How it works</Link>
							</Button>
						)}
					</div>
					<ul className="flex flex-wrap gap-x-6 gap-y-2">
						{content.items.map(({ title }) => (
							<li key={title} className="flex items-center gap-1.5">
								<CircleCheck className="size-4 text-secondary" />
								<Text as="span" variant="body-sm" tone="muted">
									{title}
								</Text>
							</li>
						))}
					</ul>
				</div>

				<ImageSlider
					slides={slides.length ? slides : builtInSlides}
					tint="caption"
					preloadFirst
					sizes="(min-width: 1024px) 45vw, 100vw"
					aria-label="Trading textbooks on campus"
					className="h-72 rounded-3xl shadow-xl shadow-primary/10 sm:h-96 lg:h-112"
				/>
			</Container>
		</section>
	);
}
