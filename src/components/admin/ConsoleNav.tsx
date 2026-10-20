"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/utils";

import { consoleNavItems } from "./nav-items";

function isActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}

/** Section links: a column in the sidebar, a scrolling row on small screens. */
export default function ConsoleNav({ orientation }: { orientation: "vertical" | "horizontal" }) {
	const pathname = usePathname();
	const vertical = orientation === "vertical";

	return (
		<nav aria-label="Console">
			<ul className={cn("flex gap-1", vertical ? "flex-col" : "overflow-x-auto")}>
				{consoleNavItems.map(({ href, label, icon: Icon }) => {
					const active = isActive(pathname, href);
					return (
						<li key={href} className="shrink-0">
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2 text-label-lg outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
									active
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<Icon aria-hidden className="size-4 shrink-0" />
								{label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
