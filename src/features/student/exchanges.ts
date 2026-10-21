import type { Exchange, ExchangeGroup } from "./types";

/**
 * The API filters behind each group: requests for the student's books to answer, agreed
 * meetups on either side (soonest first), and the student's own requests awaiting a reply.
 */
export const exchangeGroupFilters: Record<ExchangeGroup, Record<string, string>> = {
	review: { role: "seller", status: "pending" },
	meetups: { status: "accepted", ordering: "meetup_time" },
	sent: { role: "requester", status: "pending" },
};

/** The student on the other side of the exchange. */
export function counterpart(exchange: Exchange) {
	return exchange.role === "seller" ? exchange.requester : exchange.seller;
}
