import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// Auth pages used to live under /auth. Keeps old links working, including the
			// verification and password reset links in emails sent before the move.
			{ source: "/auth/:path*", destination: "/:path*", permanent: true },
		];
	},
};

export default nextConfig;
