import { ArrowLeftRight, HandHeart, Tag } from "lucide-react";

import SectionHeading from "@/components/landing/SectionHeading";
import Container from "@/components/layout/Container";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

// Matches the listing types in the backend's Listing model.
const types = [
	{
		title: "Sell",
		text: "Set your own price and get some money back for the books you have finished with.",
		icon: Tag,
		tint: "bg-primary-container text-primary-container-foreground",
	},
	{
		title: "Swap",
		text: "Offer one of your own listed books in exchange for the one you need, with no money involved.",
		icon: ArrowLeftRight,
		tint: "bg-tertiary-container text-tertiary-container-foreground",
	},
	{
		title: "Donate",
		text: "Give a book away for free to a student who needs it for their course.",
		icon: HandHeart,
		tint: "bg-secondary-container text-secondary-container-foreground",
	},
];

export default function ListingTypes() {
	return (
		<section id="sell-swap-donate" className="scroll-mt-28 py-20 md:scroll-mt-16">
			<Container>
				<SectionHeading
					eyebrow="Your books, your choice"
					title="Sell, swap or donate"
					description="Each listing states the book's condition, from new to poor, and can include photos."
				/>
				<ul className="mt-10 grid gap-6 md:grid-cols-3">
					{types.map(({ title, text, icon: Icon, tint }) => (
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
					))}
				</ul>
			</Container>
		</section>
	);
}
