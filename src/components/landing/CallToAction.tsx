import Link from "next/link";

import { SignedOut } from "@/components/landing/session";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

/** Sign-up prompt. Hidden from students who are already signed in. */
export default function CallToAction() {
	return (
		<SignedOut>
			<section className="py-20">
				<Container>
					<div className="rounded-3xl bg-panel px-6 py-14 text-center text-panel-foreground shadow-xl sm:px-12">
						<Text variant="label-sm" className="uppercase tracking-widest text-panel-accent">
							Join Akshara
						</Text>
						<Text
							as="h2"
							variant="headline-lg"
							className="mx-auto mt-3 max-w-xl sm:text-display-md"
						>
							Got books from last semester?
						</Text>
						<Text variant="body-lg" className="mx-auto mt-4 max-w-xl text-panel-muted">
							Create an account with your university email to list them, or to find the books for
							your next course.
						</Text>
						<div className="mt-8 flex flex-wrap justify-center gap-3">
							<Button
								asChild
								size="lg"
								className="rounded-full bg-panel-accent text-secondary-container-foreground hover:bg-panel-accent/90"
							>
								<Link href="/register">Create your account</Link>
							</Button>
							<Button
								asChild
								size="lg"
								className="rounded-full bg-panel-foreground/10 text-panel-foreground hover:bg-panel-foreground/20"
							>
								<Link href="/login">Sign in</Link>
							</Button>
						</div>
					</div>
				</Container>
			</section>
		</SignedOut>
	);
}
