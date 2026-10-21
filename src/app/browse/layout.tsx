import type { ReactNode } from "react";

import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import { SessionProvider } from "@/components/landing/session";
import Container from "@/components/layout/Container";
import QueryProvider from "@/components/providers/QueryProvider";
import { cmsService } from "@/services/cms.service";

/** Open to everyone, under the home page's header so visitors can find their way back. */
export default async function BrowseLayout({ children }: { children: ReactNode }) {
	const sections = await cmsService.getHomeSections();
	return (
		<QueryProvider>
			<SessionProvider>
				<div className="flex min-h-screen flex-col">
					<LandingHeader visibleSections={sections} />
					<main className="flex-1">
						<Container className="space-y-6 py-6 lg:py-10">{children}</Container>
					</main>
					<LandingFooter visibleSections={sections} />
				</div>
			</SessionProvider>
		</QueryProvider>
	);
}
