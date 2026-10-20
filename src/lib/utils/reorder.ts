/** Returns a copy of `items` with the item at `from` moved to index `to`. */
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
	const next = [...items];
	const [moved] = next.splice(from, 1);
	if (moved === undefined) return next;
	next.splice(Math.max(0, Math.min(to, next.length)), 0, moved);
	return next;
}
