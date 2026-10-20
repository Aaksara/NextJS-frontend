import { revalidateTag } from "next/cache";

import { HOME_CONTENT_TAG, SERVER_API_URL } from "@/services/cms.service";

/**
 * Clears the home page's cached content, so changes made in the admin console show on the
 * next visit. Only the super admin may call it: their access token is checked with the API.
 */
export async function POST(request: Request) {
	const authorization = request.headers.get("authorization");
	if (!authorization) return new Response(null, { status: 401 });

	const me = await fetch(`${SERVER_API_URL}/api/auth/me/`, {
		headers: { authorization },
		cache: "no-store",
	});
	if (!me.ok) return new Response(null, { status: 401 });
	const user: { is_superuser?: boolean } = await me.json();
	if (!user.is_superuser) return new Response(null, { status: 403 });

	// expire: 0, so the very next visit loads fresh content instead of the old page.
	revalidateTag(HOME_CONTENT_TAG, { expire: 0 });
	return new Response(null, { status: 204 });
}
