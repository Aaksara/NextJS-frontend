import { BookCheck, MailCheck, MapPin } from "lucide-react";

import { type HomeContent, withPositionStyles } from "@/components/landing/content";
import SectionHeading from "@/components/landing/SectionHeading";
import Container from "@/components/layout/Container";
import { ImageSlider, type Slide } from "@/components/ui/image-slider";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

/** The look of each feature, by position. The text comes from `content`. */
const featureStyles = [
	{ icon: MailCheck, tint: "bg-primary-container text-primary-container-foreground" },
	{ icon: MapPin, tint: "bg-secondary-container text-secondary-container-foreground" },
	{ icon: BookCheck, tint: "bg-tertiary-container text-tertiary-container-foreground" },
];

/** Shown until the admin publishes slides for this slider. */
const builtInSlides: Slide[] = [
	{
		image: "/images/landing/safety-inspect.svg",
		alt: "A magnifying glass over an open textbook next to a condition checklist",
		caption: "Check the book before you pay",
	},
	{
		image: "/images/landing/safety-meetup.svg",
		alt: "Two students meeting outside a campus library marked with a map pin",
		caption: "Hand books over in person",
	},
	{
		image: "/images/landing/safety-verified.svg",
		alt: "A student ID card with a university email beside a verified shield",
		caption: "Trade only with students from your university",
	},
];

interface SafetySectionProps {
	content: HomeContent["safety"];
	slides: Slide[];
}

export default function SafetySection({ content, slides }: SafetySectionProps) {
	return (
		<section id="safety" className="scroll-mt-16 border-y bg-muted/60 py-14 md:py-20">
			<Container className="grid items-center gap-12 lg:grid-cols-2">
				<div>
					<SectionHeading
						eyebrow={content.eyebrow}
						title={content.title}
						description={content.description}
					/>
					<ul className="mt-8 space-y-6">
						{withPositionStyles(content.items, featureStyles).map(
							({ title, text, icon: Icon, tint }) => (
								<li key={title} className="flex gap-4">
									<span
										className={cn(
											"flex size-9 shrink-0 items-center justify-center rounded-lg",
											tint,
										)}
									>
										<Icon className="size-4" />
									</span>
									<div>
										<Text as="h3" variant="label-lg" tone="primary">
											{title}
										</Text>
										<Text variant="body-sm" tone="muted" className="mt-1">
											{text}
										</Text>
									</div>
								</li>
							),
						)}
					</ul>
				</div>

				<ImageSlider
					slides={slides.length ? slides : builtInSlides}
					tint="caption"
					sizes="(min-width: 1024px) 45vw, 100vw"
					aria-label="Safe exchanges on campus"
					className="h-72 rounded-3xl shadow-xl shadow-primary/10 sm:h-96"
				/>
			</Container>
		</section>
	);
}
