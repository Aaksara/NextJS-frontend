import { BookOpen, MapPin } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/utils";

import type { SectionKind, SectionVariant } from "../types";

const surfaces: Record<SectionVariant, string> = {
	light: "border bg-card text-foreground",
	navy: "bg-primary text-primary-foreground",
};

/** A placeholder line of text. */
function Line({ className }: { className?: string }) {
	return <span className={cn("block h-1.5 rounded-full bg-current opacity-25", className)} />;
}

function Brand() {
	return (
		<span className="flex items-center gap-1.5 font-semibold text-label-md">
			<BookOpen aria-hidden className="size-3.5 text-secondary-container" />
			Akshara
		</span>
	);
}

/** Three cards, as in the how-it-works and listing-types sections. */
function Cards({ labels }: { labels: string[] }) {
	return (
		<div className="grid grid-cols-3 gap-2">
			{labels.map((label) => (
				<div key={label} className="space-y-1.5 rounded-md bg-current/5 p-2">
					<span className="block size-4 rounded bg-secondary-container" />
					<p className="text-label-sm">{label}</p>
					<Line className="w-4/5" />
				</div>
			))}
		</div>
	);
}

function Heading({ title }: { title: string }) {
	return <p className="text-center text-label-lg">{title}</p>;
}

const layouts: Record<SectionKind, (title: string) => ReactNode> = {
	header: () => (
		<div className="flex items-center justify-between gap-4">
			<Brand />
			<div className="flex flex-1 justify-center gap-3">
				{[1, 2, 3].map((key) => (
					<Line key={key} className="w-10" />
				))}
			</div>
			<span className="h-5 w-14 rounded-full bg-secondary-container" />
		</div>
	),
	hero: (title) => (
		<div className="grid grid-cols-[3fr_2fr] items-center gap-4 py-2">
			<div className="space-y-2">
				<p className="font-semibold text-headline-sm">{title}</p>
				<Line className="w-4/5" />
				<span className="block h-6 w-28 rounded-full bg-secondary-container" />
			</div>
			<span className="block aspect-[4/3] rounded-lg bg-current opacity-15" />
		</div>
	),
	how_it_works: (title) => (
		<div className="space-y-3">
			<Heading title={title} />
			<Cards labels={["Find", "Request", "Meet"]} />
		</div>
	),
	listing_types: (title) => (
		<div className="space-y-3">
			<Heading title={title} />
			<Cards labels={["Sell", "Swap", "Donate"]} />
		</div>
	),
	safety: (title) => (
		<div className="space-y-3">
			<Heading title={title} />
			<div className="grid grid-cols-3 gap-2">
				{["Verified", "Meetup spots", "Inspect"].map((label) => (
					<div key={label} className="space-y-1 rounded-md bg-current/5 p-2">
						<MapPin aria-hidden className="size-3.5 text-secondary" />
						<p className="text-label-sm">{label}</p>
					</div>
				))}
			</div>
		</div>
	),
	call_to_action: (title) => (
		<div className="space-y-3 py-2 text-center">
			<p className="font-semibold text-headline-sm">{title}</p>
			<span className="mx-auto block h-7 w-32 rounded-full bg-secondary-container" />
		</div>
	),
	footer: (title) => (
		<div className="space-y-3">
			<div className="grid grid-cols-4 gap-4">
				<div className="space-y-2">
					<Brand />
					<Line className="w-4/5" />
				</div>
				{["Explore", "Account", "Support"].map((heading) => (
					<div key={heading} className="space-y-1.5">
						<p className="text-label-sm">{heading}</p>
						<Line />
						<Line className="w-2/3" />
					</div>
				))}
			</div>
			<p className="border-current/20 border-t pt-2 text-label-sm opacity-70">{title}</p>
		</div>
	),
};

interface SectionPreviewProps {
	kind: SectionKind;
	variant: SectionVariant;
	title: string;
}

/** Wireframe of a section, so editors can see kind and variant changes before publishing. */
export default function SectionPreview({ kind, variant, title }: SectionPreviewProps) {
	return (
		<div aria-hidden className={cn("rounded-xl p-5 transition-colors", surfaces[variant])}>
			{layouts[kind](title)}
		</div>
	);
}
