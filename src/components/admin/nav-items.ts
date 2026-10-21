import { House, Images, type LucideIcon, School, Users } from "lucide-react";

interface ConsoleNavItem {
	href: string;
	label: string;
	icon: LucideIcon;
}

export const consoleNavItems: ConsoleNavItem[] = [
	{ href: "/admin/students", label: "Students", icon: Users },
	{ href: "/admin/slides", label: "Slides", icon: Images },
	{ href: "/admin/home", label: "Home page sections", icon: House },
	{ href: "/admin/campus", label: "Campus settings", icon: School },
];
