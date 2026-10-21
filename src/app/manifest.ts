import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Akshara",
		short_name: "Akshara",
		description: "Buy, swap and donate textbooks on campus.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#003262",
		icons: [{ src: "/icons/favicon.png", sizes: "256x256", type: "image/png" }],
	};
}
