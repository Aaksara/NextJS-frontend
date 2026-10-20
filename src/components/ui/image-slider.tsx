"use client";

import Image from "next/image";
import { type KeyboardEvent, useEffect, useState } from "react";

import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

export interface Slide {
	/** Path under /public, or a URL allowed by `images.remotePatterns`. */
	image: string;
	alt: string;
	caption: string;
}

interface ImageSliderProps {
	slides: Slide[];
	/** Rendered width of the slider, for `next/image`. */
	sizes?: string;
	/** Sets the slider's size, e.g. `h-48` or `h-full`. */
	className?: string;
	"aria-label"?: string;
}

const AUTOPLAY_MS = 6000;

/**
 * Crossfading image carousel with a caption per slide. Autoplay pauses on hover
 * and focus, and is off for users who prefer reduced motion.
 */
export function ImageSlider({
	slides,
	sizes = "100vw",
	className,
	"aria-label": ariaLabel = "Featured",
}: ImageSliderProps) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (paused || count < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		// Runs again after every slide change, so a manual move also gets a full interval.
		const timer = setTimeout(() => setActive((active + 1) % count), AUTOPLAY_MS);
		return () => clearTimeout(timer);
	}, [active, paused, count]);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "ArrowLeft") setActive((active - 1 + count) % count);
		if (event.key === "ArrowRight") setActive((active + 1) % count);
	}

	if (!count) return null;

	return (
		<section
			aria-roledescription="carousel"
			aria-label={ariaLabel}
			className={cn("relative overflow-hidden rounded-2xl bg-primary", className)}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
			}}
			onKeyDown={handleKeyDown}
		>
			{slides.map((slide, i) => (
				<div
					key={slide.image}
					aria-hidden={i !== active}
					className={cn(
						"absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
						i === active ? "opacity-100" : "opacity-0",
					)}
				>
					<Image src={slide.image} alt={slide.alt} fill sizes={sizes} className="object-cover" />
					{/* Brand-colored tint: keeps photos on palette and the caption readable. */}
					<div className="absolute inset-0 bg-linear-to-t from-primary-10/90 via-primary-10/25 to-primary-10/45" />
					<Text variant="label-lg" className="absolute inset-x-4 bottom-9 text-white">
						{slide.caption}
					</Text>
				</div>
			))}

			{count > 1 && (
				<div className="absolute bottom-3 left-3 flex">
					{slides.map((slide, i) => (
						<button
							key={slide.image}
							type="button"
							aria-label={`Go to slide ${i + 1}`}
							aria-current={i === active}
							onClick={() => setActive(i)}
							className="p-1"
						>
							<span
								className={cn(
									"block h-1.5 rounded-full transition-all",
									i === active ? "w-6 bg-white" : "w-1.5 bg-white/50",
								)}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
