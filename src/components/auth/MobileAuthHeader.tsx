"use client";

import { usePathname } from "next/navigation";

import Brand from "@/components/layout/Brand";
import SiteHeader from "@/components/layout/SiteHeader";
import { ImageSlider, type Slide } from "@/components/ui/image-slider";

/** Pages that open with the slider on phones, like an app's welcome screen. */
const SHOWCASE_PATHS = ["/login", "/register"];

/**
 * Top of the auth pages below `lg`, where the showcase panel beside the form is hidden.
 * Sign in and register get the slider under the logo; the other pages, which are
 * reached from a link mid-task, keep the plain header.
 */
export default function MobileAuthHeader({ slides }: { slides: Slide[] }) {
	const pathname = usePathname();

	if (!SHOWCASE_PATHS.includes(pathname)) return <SiteHeader className="lg:hidden" />;

	return (
		<div className="relative lg:hidden">
			<ImageSlider
				slides={slides}
				preloadFirst
				aria-label="About Akshara"
				className="h-[38dvh] max-h-96 min-h-60 rounded-none rounded-b-4xl"
			/>
			<div className="absolute top-4 left-4 rounded-full bg-card/90 py-1.5 pr-4 pl-1.5 shadow-sm backdrop-blur">
				<Brand />
			</div>
		</div>
	);
}
