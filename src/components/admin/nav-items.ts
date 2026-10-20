import { House, Images, type LucideIcon, MapPin, Users } from "lucide-react";

interface ConsoleNavItem {
	href: string;
	label: string;
	icon: LucideIcon;
}

export const consoleNavItems: ConsoleNavItem[] = [
	{ href: "/admin/students", label: "Students", icon: Users },
	{ href: "/admin/slides", label: "Homepage slides", icon: Images },
	{ href: "/admin/home", label: "Home page sections", icon: House },
	{ href: "/admin/campus", label: "Campus settings", icon: MapPin },
];
