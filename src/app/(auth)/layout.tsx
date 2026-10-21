import type { ReactNode } from "react";

import AuthShowcase from "@/components/auth/AuthShowcase";
import MobileAuthHeader from "@/components/auth/MobileAuthHeader";
import { builtInSlides } from "@/components/auth/showcase-slides";
import Container from "@/components/layout/Container";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { cmsService } from "@/services/cms.service";

/**
 * From `lg` up, the form sits in a card beside the showcase panel. Below it the page is a
 * full-screen app view, as it is when installed as a PWA: no card frame and no footer.
 */
export default async function AuthLayout({ children }: { children: ReactNode }) {
	const published = await cmsService.getSlides("sign_in");
	const slides = published.length ? published : builtInSlides;

	return (
		<div className="flex min-h-dvh flex-col bg-card lg:bg-background">
			<MobileAuthHeader slides={slides} />
			<SiteHeader className="hidden lg:block" />
			<main className="flex flex-1 lg:items-center lg:py-10">
				<Container className="max-w-6xl px-0 sm:px-0">
					<div className="lg:grid lg:grid-cols-2 lg:overflow-hidden lg:rounded-3xl lg:border lg:bg-card lg:shadow-sm">
						<AuthShowcase slides={slides} className="hidden lg:flex" />
						<div className="flex items-center px-6 pt-8 pb-10 sm:px-10 lg:p-10 xl:p-14">
							<div className="mx-auto w-full max-w-md">{children}</div>
						</div>
					</div>
				</Container>
			</main>
			<SiteFooter className="hidden lg:block" />
		</div>
	);
}
