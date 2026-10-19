import type { FormEvent } from "react";

import { ApiRequestError } from "@/lib/api/api-client";

export function getErrorMessage(error: unknown) {
	if (error instanceof ApiRequestError) return error.message;
	return "Could not reach the server. Please try again.";
}

export function getFieldErrors(error: unknown): Record<string, string[]> {
	return error instanceof ApiRequestError ? error.fields : {};
}

/** Reads the named fields of a submitted form as strings. */
export function readForm<K extends string>(event: FormEvent<HTMLFormElement>, ...names: K[]) {
	const form = new FormData(event.currentTarget);
	return Object.fromEntries(names.map((name) => [name, String(form.get(name) ?? "")])) as Record<
		K,
		string
	>;
}
