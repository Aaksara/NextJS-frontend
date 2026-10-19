import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: { default: "AKSARA", template: "%s · AKSARA" },
	description: "Buy, swap and donate textbooks on campus.",
	icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
