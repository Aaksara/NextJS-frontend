"use client";

import { BookOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils/utils";

import type { Listing } from "../types";

/** The seller's first photo of the copy, else the edition's catalogue cover. */
export function coverOf(listing: Pick<Listing, "images" | "book">) {
	return listing.images[0]?.image || listing.book.cover_url;
}

interface BookCoverProps {
	/** `""` when there is no cover; a placeholder is shown instead. */
	src: string;
	/** Rendered width, for `next/image`. */
	sizes: string;
	className?: string;
}

/** Decorative: the title is always shown next to it. */
export default function BookCover({ src, sizes, className }: BookCoverProps) {
	// Open Library answers a missing cover with a 1×1 pixel image rather than an error.
	const [failedSrc, setFailedSrc] = useState<string | null>(null);
	const showImage = src !== "" && src !== failedSrc;
	return (
		<div
			className={cn(
				"relative aspect-[3/4] shrink-0 overflow-hidden rounded-lg bg-primary-container",
				className,
			)}
		>
			{showImage ? (
				// Covers come from the API's storage and the public catalogues, which the
				// optimiser does not know.
				<Image
					src={src}
					alt=""
					fill
					unoptimized
					sizes={sizes}
					className="object-cover"
					onError={() => setFailedSrc(src)}
					onLoad={(event) => event.currentTarget.naturalWidth <= 1 && setFailedSrc(src)}
				/>
			) : (
				<div className="flex h-full items-center justify-center text-primary-container-foreground/60">
					<BookOpen aria-hidden className="size-1/3" />
				</div>
			)}
		</div>
	);
}
