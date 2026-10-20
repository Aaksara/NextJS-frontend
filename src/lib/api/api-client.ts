export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
	/\/$/,
	"",
);

const ACCESS_TOKEN_KEY = "aksaraAccessToken";
const REFRESH_TOKEN_KEY = "aksaraRefreshToken";
const REFRESH_ENDPOINT = "/api/auth/token/refresh/";
// Calls that must not trigger a token refresh when they return 401.
const NO_REFRESH = ["/api/auth/login/", REFRESH_ENDPOINT];

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestOptions = {
	/** Defaults to POST when there is a body, GET otherwise. */
	method?: ApiMethod;
	/** JSON object, or FormData for file uploads. */
	body?: object;
};

/** An error response: a message plus the messages for each form field. */
export class ApiRequestError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly fields: Record<string, string[]> = {},
	) {
		super(message);
		this.name = "ApiRequestError";
	}
}

// Remembered sessions live in localStorage; others in sessionStorage, which the
// browser clears when it closes.
const currentStore = () =>
	localStorage.getItem(REFRESH_TOKEN_KEY) ? localStorage : sessionStorage;

export const tokenStorage = {
	getAccess: () => currentStore().getItem(ACCESS_TOKEN_KEY),
	getRefresh: () => currentStore().getItem(REFRESH_TOKEN_KEY),
	isRemembered: () => currentStore() === localStorage,
	set(access: string, refresh: string, remember: boolean) {
		tokenStorage.clear();
		const store = remember ? localStorage : sessionStorage;
		store.setItem(ACCESS_TOKEN_KEY, access);
		store.setItem(REFRESH_TOKEN_KEY, refresh);
	},
	clear() {
		for (const store of [localStorage, sessionStorage]) {
			store.removeItem(ACCESS_TOKEN_KEY);
			store.removeItem(REFRESH_TOKEN_KEY);
		}
	},
};

function send(endpoint: string, { method, body }: ApiRequestOptions) {
	const isForm = body instanceof FormData;
	const headers: Record<string, string> = { Accept: "application/json" };
	if (body && !isForm) headers["Content-Type"] = "application/json";
	const token = tokenStorage.getAccess();
	if (token) headers.Authorization = `Bearer ${token}`;

	return fetch(API_URL + endpoint, {
		method: method ?? (body ? "POST" : "GET"),
		headers,
		body: isForm ? body : body ? JSON.stringify(body) : undefined,
	});
}

/** Swaps the refresh token for new tokens. Signs out if it is no longer valid. */
async function refreshTokens() {
	const refresh = tokenStorage.getRefresh();
	if (!refresh) return false;
	const response = await send(REFRESH_ENDPOINT, { body: { refresh } });
	if (!response.ok) {
		tokenStorage.clear();
		return false;
	}
	const data = await response.json();
	tokenStorage.set(data.access, data.refresh, tokenStorage.isRemembered());
	return true;
}

/** Sends the request, refreshing expired tokens once and retrying. */
async function sendWithRefresh(endpoint: string, options: ApiRequestOptions) {
	const response = await send(endpoint, options);
	if (response.status === 401 && !NO_REFRESH.includes(endpoint) && (await refreshTokens())) {
		return send(endpoint, options);
	}
	return response;
}

/** Django REST Framework errors look like {"detail": "..."} or {"field": ["..."]}. */
function toApiError(status: number, data: Record<string, unknown> | null) {
	const fields: Record<string, string[]> = {};
	for (const [key, value] of Object.entries(data ?? {})) {
		if (Array.isArray(value)) fields[key] = value.map(String);
	}
	const detail = typeof data?.detail === "string" ? data.detail : undefined;
	// A server error has no fields to highlight, and its body is usually an HTML page.
	const fallback =
		status >= 500
			? "Something went wrong on the server. Please try again later."
			: "Please check the highlighted fields.";
	const message = detail ?? fields.non_field_errors?.join(" ") ?? fallback;
	return new ApiRequestError(message, status, fields);
}

export async function requestApi<T = unknown>(
	endpoint: string,
	options: ApiRequestOptions = {},
): Promise<T> {
	const response = await sendWithRefresh(endpoint, options);
	const data = response.status === 204 ? null : await response.json().catch(() => null);
	if (response.ok) return data as T;
	throw toApiError(response.status, data);
}

/** Downloads a file the API generates, e.g. a CSV export. */
export async function requestFile(endpoint: string): Promise<Blob> {
	const response = await sendWithRefresh(endpoint, {});
	if (response.ok) return response.blob();
	throw toApiError(response.status, await response.json().catch(() => null));
}

/** A page of results from a paginated list endpoint. */
export type Paginated<T> = {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
};
