import { toast } from "sonner";

import { tokenStorage } from "@/lib/api/api-client";

/**
 * Makes the home page show the console's latest changes on its next visit. Call it after a
 * change to slides or sections has been saved; the saved change itself is not affected
 * if this fails, the page then catches up within a minute.
 */
export async function refreshHomePage() {
	const response = await fetch("/api/home-page/revalidate", {
		method: "POST",
		headers: { Authorization: `Bearer ${tokenStorage.getAccess()}` },
	}).catch(() => null);
	if (!response?.ok) {
		toast.warning("Saved. The home page may take up to a minute to show it.");
	}
}
