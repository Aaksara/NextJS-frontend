import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "AKSARA",
		short_name: "AKSARA",
		description: "Buy, swap and donate textbooks on campus.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#0a0a0a",
		icons: [
			{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	};
}
