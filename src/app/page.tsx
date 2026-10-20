import CallToAction from "@/components/landing/CallToAction";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import ListingTypes from "@/components/landing/ListingTypes";
import SafetySection from "@/components/landing/SafetySection";
import { SessionProvider } from "@/components/landing/session";

export default function HomePage() {
	return (
		<SessionProvider>
			<div className="flex min-h-screen flex-col">
				<LandingHeader />
				<main className="flex-1">
					<Hero />
					<HowItWorks />
					<ListingTypes />
					<SafetySection />
					<CallToAction />
				</main>
				<LandingFooter />
			</div>
		</SessionProvider>
	);
}
