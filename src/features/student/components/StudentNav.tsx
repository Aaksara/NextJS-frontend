"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUnreadCount } from "@/features/chat/queries";
import { cn } from "@/lib/utils/utils";

import { studentNavItems } from "../constants";
import { STUDENT_HOME, STUDENT_MESSAGES } from "../routes";

function isActive(pathname: string, href: string) {
	// The overview is the portal's root, so it would otherwise match every page.
	if (href === STUDENT_HOME) return pathname === href;
	return pathname === href || pathname.startsWith(`${href}/`);
}

export default function StudentNav({ className }: { className?: string }) {
	const pathname = usePathname();
	const unread = useUnreadCount().data ?? 0;

	return (
		<nav aria-label="Portal" className={className}>
			<ul className="flex gap-1 overflow-x-auto">
				{studentNavItems.map(({ href, label, icon: Icon }) => {
					const active = isActive(pathname, href);
					return (
						<li key={href} className="shrink-0">
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex h-9 items-center gap-2 rounded-lg px-3 text-label-lg outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
									active
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<Icon aria-hidden className="hidden size-4 sm:block" />
								{label}
								{href === STUDENT_MESSAGES && unread > 0 && (
									<span
										className={cn(
											"min-w-5 rounded-full px-1.5 text-center text-label-sm tabular-nums",
											active
												? "bg-primary-foreground text-primary"
												: "bg-primary text-primary-foreground",
										)}
									>
										<span className="sr-only">, unread: </span>
										{unread}
									</span>
								)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
