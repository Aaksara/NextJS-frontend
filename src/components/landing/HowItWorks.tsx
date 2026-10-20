import { MapPin, MessagesSquare, Search } from "lucide-react";

import SectionHeading from "@/components/landing/SectionHeading";
import Container from "@/components/layout/Container";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

const steps = [
	{
		title: "List or find a book",
		text: "Enter a book's ISBN and Akshara fills in the title, author and edition. Looking for one? Search by title, author, ISBN or course code.",
		note: "Search by course code",
		icon: Search,
		tint: "bg-primary-container text-primary-container-foreground",
	},
	{
		title: "Agree on the details",
		text: "Send the owner a request with your offer, or one of your own books for a swap, and message each other to settle the details.",
		note: "Built-in chat",
		icon: MessagesSquare,
		tint: "bg-secondary-container text-secondary-container-foreground",
	},
	{
		title: "Meet on campus",
		text: "Hand the book over at an approved spot on campus, at a time you both agree on. Check its condition before you pay.",
		note: "Payment happens in person",
		icon: MapPin,
		tint: "bg-tertiary-container text-tertiary-container-foreground",
	},
];

export default function HowItWorks() {
	return (
		<section id="how-it-works" className="scroll-mt-28 border-y bg-muted/60 py-20 md:scroll-mt-16">
			<Container>
				<SectionHeading
					align="center"
					eyebrow="Three steps"
					title="How Akshara works"
					description="Trade course books directly with other students at your university."
				/>
				<ol className="mt-12 grid gap-6 md:grid-cols-3">
					{steps.map(({ title, text, note, icon: Icon, tint }, index) => (
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
					))}
				</ol>
			</Container>
		</section>
	);
}
