import type { Metadata } from "next";
import { Suspense } from "react";

import MessagesView from "@/features/chat/components/MessagesView";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
	// The open conversation is in the URL, which is only known in the browser.
	return (
		<Suspense>
			<MessagesView />
		</Suspense>
	);
}
