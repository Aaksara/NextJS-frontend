import { Fragment, type ReactNode } from "react";

import CallToAction from "@/components/landing/CallToAction";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import ListingTypes from "@/components/landing/ListingTypes";
import SafetySection from "@/components/landing/SafetySection";
import { SessionProvider } from "@/components/landing/session";
import { cmsService, type HomeSectionKind } from "@/services/cms.service";

/** The sections, slides and their order come from the admin console. */
export default async function HomePage() {
	const [sections, heroSlides, safetySlides] = await Promise.all([
		cmsService.getHomeSections(),
		cmsService.getSlides("home_hero"),
		cmsService.getSlides("home_safety"),
	]);
	const content: Record<HomeSectionKind, ReactNode> = {
		hero: <Hero slides={heroSlides} showHowItWorks={sections.includes("how_it_works")} />,
		how_it_works: <HowItWorks />,
		listing_types: <ListingTypes />,
		safety: <SafetySection slides={safetySlides} />,
		call_to_action: <CallToAction />,
	};

	return (
		<SessionProvider>
			<div className="flex min-h-screen flex-col">
				<LandingHeader visibleSections={sections} />
				<main className="flex-1">
					{sections.map((kind) => (
						<Fragment key={kind}>{content[kind]}</Fragment>
					))}
				</main>
				<LandingFooter visibleSections={sections} />
			</div>
		</SessionProvider>
	);
}
