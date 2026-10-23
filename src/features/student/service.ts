import { type Paginated, requestApi } from "@/lib/api/api-client";

import {
	BROWSE_PAGE_SIZE,
	EXCHANGE_PAGE_SIZE,
	MAX_PAGE_SIZE,
	MY_LISTINGS_PAGE_SIZE,
} from "./constants";
import { exchangeGroupFilters } from "./exchanges";
import type {
	Exchange,
	ExchangeGroup,
	ExchangeInput,
	ExchangeQuery,
	ListingChanges,
	ListingImage,
	ListingInput,
	ListingQuery,
	MyListingQuery,
	ViewerListing,
} from "./types";

const LISTINGS = "/api/listings/";
const EXCHANGES = "/api/exchanges/";

/** Query string without the empty values, which the API would read as filters. */
function params(values: Record<string, string | number>) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(values)) {
		if (value !== "") search.append(key, String(value));
	}
	return search.toString();
}

/** Just the number of results: the smallest page, for its `count`. */
async function countOf(endpoint: string, filters: Record<string, string>) {
	const page = await requestApi<Paginated<unknown>>(
		`${endpoint}?${params({ ...filters, page_size: 1 })}`,
	);
	return page.count;
}

const exchangeAction = (id: number, name: string) =>
	requestApi<Exchange>(`${EXCHANGES}${id}/${name}/`, { method: "POST" });

export const studentService = {
	/** Available listings from everyone, the student's own included. */
	browse: ({ search, listing_type, page }: ListingQuery) =>
		requestApi<Paginated<ViewerListing>>(
			`${LISTINGS}?${params({ search, listing_type, page, page_size: BROWSE_PAGE_SIZE })}`,
		),

	myListings: ({ status, page }: MyListingQuery) =>
		requestApi<Paginated<ViewerListing>>(
			`${LISTINGS}mine/?${params({ status, page, page_size: MY_LISTINGS_PAGE_SIZE })}`,
		),

	availableListingCount: () => countOf(`${LISTINGS}mine/`, { status: "available" }),

	/**
	 * The student's listings that can be offered in a swap. One page of the API's largest
	 * size: nobody has more books on the shelf than that.
	 */
	swappableListings: () =>
		requestApi<Paginated<ViewerListing>>(
			`${LISTINGS}mine/?${params({ status: "available", page_size: MAX_PAGE_SIZE })}`,
		),

	createListing: (input: ListingInput) => requestApi<ViewerListing>(LISTINGS, { body: input }),

	updateListing: (id: number, changes: ListingChanges) =>
		requestApi<ViewerListing>(`${LISTINGS}${id}/`, { method: "PATCH", body: changes }),

	/** Seller only. Photos show in upload order; the first is the listing's cover. */
	addListingPhoto: (listingId: number, file: File) => {
		const body = new FormData();
		body.append("image", file);
		return requestApi<ListingImage>(`${LISTINGS}${listingId}/images/`, { body });
	},

	removeListingPhoto: (listingId: number, imageId: number) =>
		requestApi<void>(`${LISTINGS}${listingId}/images/${imageId}/`, { method: "DELETE" }),

	exchanges: ({ group, page }: ExchangeQuery) => {
		const filters = { ...exchangeGroupFilters[group], page, page_size: EXCHANGE_PAGE_SIZE };
		return requestApi<Paginated<Exchange>>(`${EXCHANGES}?${params(filters)}`);
	},

	exchangeCount: (group: ExchangeGroup) => countOf(EXCHANGES, exchangeGroupFilters[group]),

	completedExchangeCount: () => countOf(EXCHANGES, { status: "completed" }),

	requestListing: (input: ExchangeInput) => requestApi<Exchange>(EXCHANGES, { body: input }),

	/** Seller only. Reserves the book; the two students then arrange the handover. */
	accept: (id: number) => exchangeAction(id, "accept"),

	/** Seller only, while pending. */
	reject: (id: number) => exchangeAction(id, "reject"),

	/** The requester, or the seller once accepted. Frees a reserved book. */
	cancel: (id: number) => exchangeAction(id, "cancel"),

	/** Either side, after the handover. */
	complete: (id: number) => exchangeAction(id, "complete"),
};
