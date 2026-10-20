import { GalleryHorizontal, LayoutTemplate, type LucideIcon, MapPin, Users } from "lucide-react";

interface ConsoleNavItem {
	href: string;
	label: string;
	icon: LucideIcon;
}

export const consoleNavItems: ConsoleNavItem[] = [
	{ href: "/admin/components", label: "Component CMS", icon: LayoutTemplate },
	{ href: "/admin/banners", label: "Sliders & Banners", icon: GalleryHorizontal },
	{ href: "/admin/campus", label: "Campus settings", icon: MapPin },
	{ href: "/admin/students", label: "Student Directory", icon: Users },
];
