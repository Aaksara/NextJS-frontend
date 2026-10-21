import { BookCopy, LayoutDashboard, type LucideIcon, MessagesSquare } from "lucide-react";

import type { BadgeTone } from "@/components/ui/badge";

import { STUDENT_HOME, STUDENT_LISTINGS, STUDENT_MESSAGES } from "./routes";
import type { ExchangeStatus } from "./types";

export const BROWSE_PAGE_SIZE = 8;

export const MY_LISTINGS_PAGE_SIZE = 12;

export const EXCHANGE_PAGE_SIZE = 5;

/** The API's largest page (`max_page_size` in `utilities/pagination.py`). */
export const MAX_PAGE_SIZE = 100;

interface StudentNavItem {
	href: string;
	label: string;
	icon: LucideIcon;
}

export const studentNavItems: StudentNavItem[] = [
	{ href: STUDENT_HOME, label: "Overview", icon: LayoutDashboard },
	{ href: STUDENT_LISTINGS, label: "My listings", icon: BookCopy },
	{ href: STUDENT_MESSAGES, label: "Messages", icon: MessagesSquare },
];

export const exchangeStatusLabels: Record<ExchangeStatus, string> = {
	pending: "Pending",
	accepted: "Accepted",
	rejected: "Declined",
	cancelled: "Cancelled",
	completed: "Completed",
};

export const exchangeStatusTones: Record<ExchangeStatus, BadgeTone> = {
	pending: "warning",
	accepted: "success",
	rejected: "neutral",
	cancelled: "neutral",
	completed: "primary",
};
