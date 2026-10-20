/** Returns a copy of `items` with the item at `from` moved to index `to`. */
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
	const next = [...items];
	const [moved] = next.splice(from, 1);
	if (moved === undefined) return next;
	next.splice(Math.max(0, Math.min(to, next.length)), 0, moved);
	return next;
}

/**
 * Moves the item with id `fromId` to where `toId` is. Works on the full list even when the
 * user only sees a filtered part of it.
 */
export function moveById<T extends { id: string | number }>(
	items: readonly T[],
	fromId: T["id"],
	toId: T["id"],
): T[] {
	const from = items.findIndex((item) => item.id === fromId);
	const to = items.findIndex((item) => item.id === toId);
	if (from === -1 || to === -1) return [...items];
	return moveItem(items, from, to);
}
