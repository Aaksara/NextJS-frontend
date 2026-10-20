import { type DragEvent, type KeyboardEvent, useState } from "react";

interface DragReorderOptions<Id> {
	/** Called with the dragged item's id and the id of the item it was dropped on. */
	onMove: (fromId: Id, toId: Id) => void;
}

/**
 * Native drag and drop for reordering rows, plus arrow keys on the drag handle so the
 * same action works without a mouse.
 */
export function useDragReorder<Id extends string | number>({ onMove }: DragReorderOptions<Id>) {
	const [draggingId, setDraggingId] = useState<Id | null>(null);
	const [overId, setOverId] = useState<Id | null>(null);

	function reset() {
		setDraggingId(null);
		setOverId(null);
	}

	/** Spread on each row. */
	function rowProps(id: Id) {
		return {
			draggable: true,
			"data-dragging": draggingId === id || undefined,
			"data-drop-target": (overId === id && draggingId !== id) || undefined,
			onDragStart(event: DragEvent) {
				event.dataTransfer.effectAllowed = "move";
				setDraggingId(id);
			},
			onDragOver(event: DragEvent) {
				if (draggingId === null) return;
				event.preventDefault();
				setOverId(id);
			},
			onDrop(event: DragEvent) {
				event.preventDefault();
				if (draggingId !== null && draggingId !== id) onMove(draggingId, id);
				reset();
			},
			onDragEnd: reset,
		};
	}

	/** Spread on the row's drag handle button. `previous` and `next` are the neighbouring ids. */
	function handleProps(id: Id, { previous, next }: { previous?: Id; next?: Id }) {
		return {
			onKeyDown(event: KeyboardEvent) {
				let toId: Id | undefined;
				if (event.key === "ArrowUp") toId = previous;
				if (event.key === "ArrowDown") toId = next;
				if (toId === undefined) return;
				event.preventDefault();
				onMove(id, toId);
			},
		};
	}

	return { rowProps, handleProps };
}
