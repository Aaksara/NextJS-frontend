"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { useSession } from "@/components/landing/session";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Text, textVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

interface MobileMenuProps {
	links: { href: string; label: string }[];
	className?: string;
}

/**
 * The header's links and account actions behind a menu button, for phones. The panel drops
 * down from the header; a tap outside it, Escape or picking a link closes it.
 */
export default function MobileMenu({ links, className }: MobileMenuProps) {
	const [open, setOpen] = useState(false);
	const { user, signOut } = useSession();
	const panelId = useId();
	const close = () => setOpen(false);

	useEffect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [open]);

	return (
		<div className={className}>
			<IconButton
				variant="ghost"
				label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen(!open)}
				className="text-foreground [&_svg:not([class*='size-'])]:size-5"
			>
				{open ? <X /> : <Menu />}
			</IconButton>

			{open && (
				<>
					{/* Positioned against the sticky header, so both start right under it. */}
					<button
						type="button"
						aria-label="Close menu"
						tabIndex={-1}
						onClick={close}
						className="absolute inset-x-0 top-full h-dvh bg-neutral-10/30"
					/>
					<div
						id={panelId}
						className="absolute inset-x-0 top-full rounded-b-3xl border-b bg-card px-4 pt-2 pb-5 shadow-lg"
					>
						<nav aria-label="Sections">
							<ul>
								{links.map(({ href, label }) => (
									<li key={href}>
										<Link
											href={href}
											onClick={close}
											className={textVariants({
												variant: "label-lg",
												className:
													"flex h-12 items-center rounded-lg px-3 text-foreground transition-colors hover:bg-muted",
											})}
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<div className={cn("grid gap-2", links.length > 0 && "mt-2 border-t pt-4")}>
							{user ? (
								<>
									<Text variant="label-lg" tone="muted" className="px-3 pb-1">
										Signed in as {user.full_name}
									</Text>
									<Button variant="outlined" size="lg" className="rounded-full" onClick={signOut}>
										Sign out
									</Button>
								</>
							) : (
								<>
									<Button asChild size="lg" className="rounded-full">
										<Link href="/register">Get started</Link>
									</Button>
									<Button asChild variant="outlined" size="lg" className="rounded-full">
										<Link href="/login">Sign in</Link>
									</Button>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
