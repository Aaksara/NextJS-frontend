import { BookOpen, MapPin, MessageCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ImageSlider, type Slide } from "@/components/ui/image-slider";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

const steps = [
	{ icon: BookOpen, text: "List a book by its ISBN to sell, swap or donate" },
	{ icon: MessageCircle, text: "Chat to agree on the condition and a time" },
	{ icon: MapPin, text: "Meet on campus and pay in person" },
];

const slides: Slide[] = [
	{
		image: "/images/slides/campus-library.webp",
		alt: "Curved library shelves full of books",
		caption: "Find the books for your course",
	},
	{
		image: "/images/slides/textbook-stack.webp",
		alt: "A stack of textbooks",
		caption: "List a book in seconds",
	},
	{
		image: "/images/slides/graduation.webp",
		alt: "Graduates throwing their caps in the air",
		caption: "Pass your textbooks on",
	},
];

/** Marketing panel joined to the auth form on wide screens. */
export default function AuthShowcase({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"flex-col gap-8 bg-linear-to-br from-primary-container/70 via-card to-primary-container/40 p-10 xl:p-12",
				className,
			)}
		>
			<div className="space-y-4">
				<Badge>
					<Sparkles />
					How Akshara works
				</Badge>
				<Text as="p" variant="headline-lg" tone="primary" className="max-w-sm">
					Pass your textbooks on to the next student.
				</Text>
			</div>

			<ul className="space-y-4">
				{steps.map(({ icon: Icon, text }) => (
					<li key={text} className="flex items-center gap-3">
						<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Icon className="size-4" />
						</span>
						<Text tone="muted">{text}</Text>
					</li>
				))}
			</ul>

			<ImageSlider
				slides={slides}
				sizes="(min-width: 1280px) 480px, 40vw"
				aria-label="About Akshara"
				className="mt-auto h-56 shadow-md"
			/>
		</div>
	);
}
