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

/** The sections, their text, slides and order come from the admin console. */
export default async function HomePage() {
	const [sections, content, heroSlides, safetySlides] = await Promise.all([
		cmsService.getHomeSections(),
		cmsService.getHomeContent(),
		cmsService.getSlides("home_hero"),
		cmsService.getSlides("home_safety"),
	]);
	const sectionElements: Record<HomeSectionKind, ReactNode> = {
		hero: (
			<Hero
				content={content.hero}
				slides={heroSlides}
				showHowItWorks={sections.includes("how_it_works")}
			/>
		),
		how_it_works: <HowItWorks content={content.how_it_works} />,
		listing_types: <ListingTypes content={content.listing_types} />,
		safety: <SafetySection content={content.safety} slides={safetySlides} />,
		call_to_action: <CallToAction content={content.call_to_action} />,
	};

	return (
		<SessionProvider>
			<div className="flex min-h-screen flex-col">
				<LandingHeader visibleSections={sections} />
				<main className="flex-1">
					{sections.map((kind) => (
						<Fragment key={kind}>{sectionElements[kind]}</Fragment>
					))}
				</main>
				<LandingFooter visibleSections={sections} />
			</div>
		</SessionProvider>
	);
}
