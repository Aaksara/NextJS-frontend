/**
 * Turns text into an anchor ID: lowercase letters, digits and single hyphens.
 * "Spring Book Fair!" becomes "spring-book-fair". Pass `whileTyping` to keep a trailing
 * hyphen, so the user can type "spring-" on the way to "spring-fair".
 */
export function toAnchorId(text: string, whileTyping = false) {
	const slug = text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+/, "");
	return whileTyping ? slug : slug.replace(/-+$/, "");
}
