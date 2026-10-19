import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: { default: "AKSARA", template: "%s · AKSARA" },
	description: "Buy, swap and donate textbooks on campus.",
	icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSerif = DM_Serif_Display({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-dm-serif",
});

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
			<body className="min-h-screen antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
