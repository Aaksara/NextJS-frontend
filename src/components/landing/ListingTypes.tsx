import { ArrowLeftRight, HandHeart, Tag } from "lucide-react";

import { type HomeContent, withPositionStyles } from "@/components/landing/content";
import SectionHeading from "@/components/landing/SectionHeading";
import Container from "@/components/layout/Container";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

/** The look of each card, by position: sell, swap, donate, as in the backend's Listing model. */
const cardStyles = [
	{ icon: Tag, tint: "bg-primary-container text-primary-container-foreground" },
	{ icon: ArrowLeftRight, tint: "bg-tertiary-container text-tertiary-container-foreground" },
	{ icon: HandHeart, tint: "bg-secondary-container text-secondary-container-foreground" },
];

export default function ListingTypes({ content }: { content: HomeContent["listing_types"] }) {
	return (
		<section id="sell-swap-donate" className="scroll-mt-16 py-14 md:py-20">
			<Container>
				<SectionHeading
					eyebrow={content.eyebrow}
					title={content.title}
					description={content.description}
				/>
				<ul className="mt-10 grid gap-6 md:grid-cols-3">
					{withPositionStyles(content.items, cardStyles).map(
						({ title, text, icon: Icon, tint }) => (
							<li key={title} className="rounded-2xl border bg-card p-6 shadow-sm">
								<span className={cn("flex size-11 items-center justify-center rounded-xl", tint)}>
									<Icon className="size-5" />
								</span>
								<Text as="h3" variant="headline-sm" tone="primary" className="mt-5">
									{title}
								</Text>
								<Text tone="muted" className="mt-2">
									{text}
								</Text>
							</li>
						),
					)}
				</ul>
			</Container>
		</section>
	);
}
