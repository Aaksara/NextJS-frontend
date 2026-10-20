"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { IconButton } from "@/components/ui/icon-button";

export interface NavBarItem {
	href: string;
	label: string;
	icon: ReactNode;
}

function isActive(pathname: string, href: string) {
	return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Icon navigation that highlights the item for the current route. */
export function NavBar({ items }: { items: NavBarItem[] }) {
	const pathname = usePathname();

	return (
		<nav aria-label="Main" className="inline-flex rounded-lg bg-muted p-1.5">
			<ul className="flex items-center gap-2">
				{items.map(({ href, label, icon }) => {
					const active = isActive(pathname, href);
					return (
						<li key={href}>
							<IconButton
								asChild
								label={label}
								variant={active ? "primary" : "ghost"}
								className="rounded-md"
							>
								<Link href={href} aria-current={active ? "page" : undefined}>
									{icon}
								</Link>
							</IconButton>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
