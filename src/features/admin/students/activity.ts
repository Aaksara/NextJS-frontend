import type { ActivityEvent } from "./types";

/** What happened, worded from the student's side, e.g. "Requested “Dune” from Sam Lee". */
export function describeActivity({ kind, role, book_title, counterpart }: ActivityEvent) {
	const book = `“${book_title}”`;
	const asBuyer = role === "buyer";
	switch (kind) {
		case "joined":
			return "Joined the marketplace";
		case "listed":
			return `Listed ${book}`;
		case "requested":
			return asBuyer ? `Requested ${book} from ${counterpart}` : `${counterpart} requested ${book}`;
		case "accepted":
			return asBuyer
				? `${counterpart} accepted the request for ${book}`
				: `Accepted ${counterpart}'s request for ${book}`;
		// Declines and cancellations can be automatic (the book was traded or withdrawn), so these
		// don't say who did it.
		case "rejected":
			return asBuyer
				? `Request for ${book} was declined`
				: `${counterpart}'s request for ${book} was declined`;
		case "cancelled":
			return asBuyer
				? `Request for ${book} was cancelled`
				: `${counterpart}'s request for ${book} was cancelled`;
		case "completed":
			return `Completed the exchange of ${book} with ${counterpart}`;
		case "messaged":
			return asBuyer
				? `Messaged ${counterpart} about ${book}`
				: `${counterpart} messaged about ${book}`;
	}
}
