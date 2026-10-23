import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { listingsKey } from "@/features/listings/keys";
import { getErrorMessage, getFieldErrors } from "@/lib/utils/page-helpers";

import type { PhotoChanges } from "./photos";
import { studentService } from "./service";
import type {
	ExchangeGroup,
	ExchangeQuery,
	ListingChanges,
	ListingInput,
	ListingQuery,
	MyListingQuery,
} from "./types";

const listings = listingsKey;
const exchanges = ["student", "exchanges"] as const;

/**
 * An exchange changes the status of the listings in it, so exchange changes refresh both.
 * Listing changes only refresh listings.
 */
const studentKeys = {
	listings,
	browse: (query: ListingQuery) => [...listings, "browse", query] as const,
	mine: (query: MyListingQuery) => [...listings, "mine", query] as const,
	swappable: [...listings, "swappable"] as const,
	availableCount: [...listings, "available-count"] as const,
	exchanges,
	exchangePage: (query: ExchangeQuery) => [...exchanges, "page", query] as const,
	exchangeCount: (group: ExchangeGroup) => [...exchanges, "count", group] as const,
	completedCount: [...exchanges, "completed-count"] as const,
};

export function useBrowseListings(query: ListingQuery) {
	return useQuery({
		queryKey: studentKeys.browse(query),
		queryFn: () => studentService.browse(query),
		placeholderData: keepPreviousData,
	});
}

export function useMyListings(query: MyListingQuery) {
	return useQuery({
		queryKey: studentKeys.mine(query),
		queryFn: () => studentService.myListings(query),
		placeholderData: keepPreviousData,
	});
}

export function useSwappableListings(enabled: boolean) {
	return useQuery({
		queryKey: studentKeys.swappable,
		queryFn: studentService.swappableListings,
		select: (page) => page.results,
		enabled,
	});
}

export function useAvailableListingCount() {
	return useQuery({
		queryKey: studentKeys.availableCount,
		queryFn: studentService.availableListingCount,
	});
}

export function useExchanges(query: ExchangeQuery) {
	return useQuery({
		queryKey: studentKeys.exchangePage(query),
		queryFn: () => studentService.exchanges(query),
		placeholderData: keepPreviousData,
	});
}

export function useExchangeCount(group: ExchangeGroup) {
	return useQuery({
		queryKey: studentKeys.exchangeCount(group),
		queryFn: () => studentService.exchangeCount(group),
	});
}

export function useCompletedExchangeCount() {
	return useQuery({
		queryKey: studentKeys.completedCount,
		queryFn: studentService.completedExchangeCount,
	});
}

/** Refreshes everything an exchange touches. */
function useRefreshExchanges() {
	const queryClient = useQueryClient();
	return () =>
		Promise.all([
			queryClient.invalidateQueries({ queryKey: studentKeys.exchanges }),
			queryClient.invalidateQueries({ queryKey: studentKeys.listings }),
		]);
}

/**
 * Applies the form's photo changes to a saved listing. Removals go first to make room
 * under the photo limit, and uploads go one at a time to keep the order they were picked in.
 *
 * Returns the first failure rather than throwing: the listing itself is saved by then, and
 * submitting the form again would list the book twice.
 */
async function applyPhotoChanges(listingId: number, { added, removed }: PhotoChanges) {
	try {
		await Promise.all(removed.map((id) => studentService.removeListingPhoto(listingId, id)));
		for (const file of added) await studentService.addListingPhoto(listingId, file);
		return null;
	} catch (error) {
		return error;
	}
}

function reportPhotoFailure(title: string, error: unknown) {
	// The form has closed, so a rejected file's message cannot go next to a field.
	const reason = getFieldErrors(error).image?.join(" ") ?? getErrorMessage(error);
	toast.error(`${title} is saved, but its photos were not all updated`, {
		description: `${reason} Edit the listing to try again.`,
	});
}

/** Lists a book with its photos. Errors saving the listing are left to the form. */
export function useCreateListing() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ input, photos }: { input: ListingInput; photos: PhotoChanges }) => {
			const listing = await studentService.createListing(input);
			return { listing, photoError: await applyPhotoChanges(listing.id, photos) };
		},
		onSuccess: ({ listing, photoError }) =>
			photoError
				? reportPhotoFailure(listing.book.title, photoError)
				: toast.success(`${listing.book.title} is listed`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: studentKeys.listings }),
	});
}

/** Edits a listing and its photos. Errors saving the listing are left to the form. */
export function useUpdateListing() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			input,
			photos,
		}: {
			id: number;
			input: ListingChanges;
			photos: PhotoChanges;
		}) => {
			const listing = await studentService.updateListing(id, input);
			return { listing, photoError: await applyPhotoChanges(id, photos) };
		},
		onSuccess: ({ listing, photoError }) =>
			photoError
				? reportPhotoFailure(listing.book.title, photoError)
				: toast.success("Listing updated"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: studentKeys.listings }),
	});
}

/** Withdraws a listing, or puts a withdrawn one back on the shelf. */
export function useSetListingAvailable() {
	const refresh = useRefreshExchanges();
	return useMutation({
		mutationFn: ({ id, available }: { id: number; available: boolean }) =>
			studentService.updateListing(id, { status: available ? "available" : "withdrawn" }),
		onSuccess: (listing) =>
			toast.success(
				listing.status === "available"
					? `${listing.book.title} is back on the shelf`
					: `${listing.book.title} withdrawn`,
			),
		onError: (error) => toast.error(getErrorMessage(error)),
		// Withdrawing declines the requests waiting on the listing.
		onSettled: refresh,
	});
}

/** Sends a request for a listing. Errors are left to the form. */
export function useRequestListing() {
	const refresh = useRefreshExchanges();
	return useMutation({
		mutationFn: studentService.requestListing,
		onSuccess: (exchange) => toast.success(`Request sent to ${exchange.seller.full_name}`),
		onSettled: refresh,
	});
}

function useExchangeAction(action: (id: number) => Promise<unknown>, successMessage: string) {
	const refresh = useRefreshExchanges();
	return useMutation({
		mutationFn: action,
		onSuccess: () => toast.success(successMessage),
		onError: (error) => toast.error(getErrorMessage(error)),
		onSettled: refresh,
	});
}

export const useAcceptExchange = () =>
	useExchangeAction(studentService.accept, "Request accepted. The book is reserved for them.");

export const useRejectExchange = () => useExchangeAction(studentService.reject, "Request declined");

export const useCancelExchange = () =>
	useExchangeAction(studentService.cancel, "Exchange cancelled");

export const useCompleteExchange = () =>
	useExchangeAction(studentService.complete, "Exchange completed");
