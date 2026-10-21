import { MapPin, MessagesSquare, Search } from "lucide-react";

import { type HomeContent, withPositionStyles } from "@/components/landing/content";
import SectionHeading from "@/components/landing/SectionHeading";
import Container from "@/components/layout/Container";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

/** The look of each step, by position. The text comes from `content`. */
const stepStyles = [
	{ icon: Search, tint: "bg-primary-container text-primary-container-foreground" },
	{ icon: MessagesSquare, tint: "bg-secondary-container text-secondary-container-foreground" },
	{ icon: MapPin, tint: "bg-tertiary-container text-tertiary-container-foreground" },
];

export default function HowItWorks({ content }: { content: HomeContent["how_it_works"] }) {
	return (
		<section id="how-it-works" className="scroll-mt-28 border-y bg-muted/60 py-20 md:scroll-mt-16">
			<Container>
				<SectionHeading
					align="center"
					eyebrow={content.eyebrow}
					title={content.title}
					description={content.description}
				/>
				<ol className="mt-12 grid gap-6 md:grid-cols-3">
					{withPositionStyles(content.items, stepStyles).map(
						({ title, text, note, icon: Icon, tint }, index) => (
							<li key={title} className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm">
								<span
									className={cn(
										"flex size-10 items-center justify-center rounded-lg text-label-lg",
										tint,
									)}
								>
									{index + 1}
								</span>
								<Text as="h3" variant="headline-sm" tone="primary" className="mt-6">
									{title}
								</Text>
								<Text tone="muted" className="mt-2 flex-1">
									{text}
								</Text>
								<Text variant="label-sm" className="mt-5 flex items-center gap-1.5 text-secondary">
									<Icon className="size-3.5" />
									{note}
								</Text>
							</li>
						),
					)}
				</ol>
			</Container>
		</section>
	);
}
