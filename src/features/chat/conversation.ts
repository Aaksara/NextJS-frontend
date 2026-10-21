import type { Conversation } from "./types";

/** The student on the other side of the conversation from `studentId`. */
export function otherSide(conversation: Conversation, studentId: number) {
	return conversation.seller.id === studentId ? conversation.buyer : conversation.seller;
}
