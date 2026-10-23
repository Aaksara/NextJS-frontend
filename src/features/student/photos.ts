import type { ListingImage } from "./types";

/** `MAX_LISTING_IMAGES` in the API's settings. */
export const MAX_LISTING_PHOTOS = 5;

/** `MAX_IMAGE_UPLOAD_BYTES` in the API's settings, kept under Vercel's 4.5 MB body limit. */
export const MAX_PHOTO_MB = 4;

/** `WEB_IMAGE_TYPES` in the API's validators. */
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** A photo picked in the form, shown from the device until the listing is saved. */
export interface NewPhoto {
	key: number;
	file: File;
	preview: string;
}

/** What saving the form does to a listing's photos. */
export interface PhotoChanges {
	/** In the order picked; the first photo of a listing is its cover. */
	added: File[];
	/** Ids of the listing's photos the seller took out. */
	removed: number[];
}

/** Why the file cannot be uploaded, or `null` if it can. */
export function photoProblem(file: Pick<File, "name" | "size" | "type">) {
	if (!PHOTO_TYPES.includes(file.type)) return `${file.name} is not a JPEG, PNG or WebP image.`;
	if (file.size > MAX_PHOTO_MB * 1024 * 1024) return `${file.name} is over ${MAX_PHOTO_MB} MB.`;
	return null;
}

/** Ids of the photos the listing had that are no longer kept. */
export function removedPhotoIds(initial: ListingImage[], kept: ListingImage[]) {
	const keptIds = new Set(kept.map((image) => image.id));
	return initial.filter((image) => !keptIds.has(image.id)).map((image) => image.id);
}
