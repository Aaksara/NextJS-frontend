import type { ListingStatus, ListingType } from "@/features/listings/types";
import type { BookSummary, PublicUser } from "@/features/student/types";

export interface Message {
	id: number;
	conversation: number;
	/** The sender's user id. */
	sender: number;
	body: string;
	created_at: string;
	/** When the other student read it; `null` while unread. */
	read_at: string | null;
}

/** A private chat between a listing's seller and one buyer. */
export interface Conversation {
	id: number;
	listing_detail: {
		id: number;
		book: BookSummary;
		price: string | null;
		listing_type: ListingType;
		status: ListingStatus;
	};
	buyer: PublicUser;
	seller: PublicUser;
	last_message: Message | null;
	/** Messages from the other student not read yet. */
	unread_count: number;
	created_at: string;
	updated_at: string;
}
