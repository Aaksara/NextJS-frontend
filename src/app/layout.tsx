import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: { default: "Akshara", template: "%s · Akshara" },
	description: "Buy, swap and donate textbooks on campus.",
	icons: { icon: "/icons/favicon.png", apple: "/icons/favicon.png" },
};

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-plus-jakarta-sans",
});

export const viewport: Viewport = { themeColor: "#003262" };

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={plusJakartaSans.variable}>
			<body className="min-h-screen antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
