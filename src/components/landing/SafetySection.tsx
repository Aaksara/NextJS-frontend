import { BookCheck, MailCheck, MapPin } from "lucide-react";

import SectionHeading from "@/components/landing/SectionHeading";
import Container from "@/components/layout/Container";
import { ImageSlider, type Slide } from "@/components/ui/image-slider";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

const features = [
	{
		title: "University email sign-up",
		text: "Registration only accepts your university's email domains, and you verify the address before you can sign in.",
		icon: MailCheck,
		tint: "bg-primary-container text-primary-container-foreground",
	},
	{
		title: "Approved meeting spots",
		text: "Handovers take place at campus locations approved by the Akshara team, at a time you both agree on.",
		icon: MapPin,
		tint: "bg-secondary-container text-secondary-container-foreground",
	},
	{
		title: "Check before you pay",
		text: "You see the book in person before any money changes hands, so you know it matches the listing.",
		icon: BookCheck,
		tint: "bg-tertiary-container text-tertiary-container-foreground",
	},
];

const slides: Slide[] = [
	{
		image: "/images/landing/safety-inspect.svg",
		alt: "A magnifying glass over an open textbook next to a condition checklist",
		caption: "Check the book before you pay",
	},
	{
		image: "/images/landing/safety-meetup.svg",
		alt: "Two students meeting outside a campus library marked with a map pin",
		caption: "Meet at approved campus spots",
	},
	{
		image: "/images/landing/safety-verified.svg",
		alt: "A student ID card with a university email beside a verified shield",
		caption: "Trade only with students from your university",
	},
];

export default function SafetySection() {
	return (
		<section id="safety" className="scroll-mt-28 border-y bg-muted/60 py-20 md:scroll-mt-16">
			<Container className="grid items-center gap-12 lg:grid-cols-2">
				<div>
					<SectionHeading
						eyebrow="Built for your campus"
						title="Trade only with students from your university."
						description="Akshara isn't open to the public. Everyone you meet signed up with a university email address."
					/>
					<ul className="mt-8 space-y-6">
						{features.map(({ title, text, icon: Icon, tint }) => (
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
						))}
					</ul>
				</div>

				<ImageSlider
					slides={slides}
					tint="caption"
					sizes="(min-width: 1024px) 45vw, 100vw"
					aria-label="Safe exchanges on campus"
					className="h-80 rounded-3xl shadow-xl shadow-primary/10 sm:h-96"
				/>
			</Container>
		</section>
	);
}
