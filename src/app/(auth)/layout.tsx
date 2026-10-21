import type { ReactNode } from "react";

import AuthShowcase from "@/components/auth/AuthShowcase";
import Container from "@/components/layout/Container";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { Card } from "@/components/ui/card";
import { cmsService } from "@/services/cms.service";

export default async function AuthLayout({ children }: { children: ReactNode }) {
	const slides = await cmsService.getSlides("sign_in");

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<SiteHeader />
			<main className="flex flex-1 items-start py-6 lg:items-center lg:py-10">
				<Container className="max-w-6xl">
					<Card className="mx-auto max-w-md gap-0 overflow-hidden rounded-3xl p-0 lg:grid lg:max-w-none lg:grid-cols-2">
						<AuthShowcase slides={slides} className="hidden lg:flex" />
						<div className="flex items-center p-6 sm:p-10 xl:p-14">
							<div className="mx-auto w-full max-w-md">{children}</div>
						</div>
					</Card>
				</Container>
			</main>
			<SiteFooter />
		</div>
	);
}
