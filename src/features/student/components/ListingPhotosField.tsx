"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

import {
	MAX_LISTING_PHOTOS,
	MAX_PHOTO_MB,
	type NewPhoto,
	PHOTO_TYPES,
	type PhotoChanges,
	photoProblem,
	removedPhotoIds,
} from "../photos";
import type { ListingImage } from "../types";

/** The form's photos: the listing's own ones still kept, then those picked since. */
export function useListingPhotos(initial: ListingImage[] = []) {
	const [kept, setKept] = useState(initial);
	const [added, setAdded] = useState<NewPhoto[]>([]);
	const [problem, setProblem] = useState<string | null>(null);

	const nextKey = useRef(0);
	// Each preview holds its file in memory until it is revoked.
	const previews = useRef(new Set<string>());
	useEffect(() => {
		const urls = previews.current;
		return () => {
			for (const url of urls) URL.revokeObjectURL(url);
		};
	}, []);

	const room = MAX_LISTING_PHOTOS - kept.length - added.length;

	function add(files: File[]) {
		const problems: string[] = [];
		const usable: File[] = [];
		for (const file of files) {
			const message = photoProblem(file);
			if (message) problems.push(message);
			else usable.push(file);
		}
		if (usable.length > room) problems.push(`A listing can have ${MAX_LISTING_PHOTOS} photos.`);
		setProblem(problems.length ? problems.join(" ") : null);

		const photos = usable.slice(0, room).map((file) => {
			const preview = URL.createObjectURL(file);
			previews.current.add(preview);
			nextKey.current += 1;
			return { key: nextKey.current, file, preview };
		});
		setAdded((current) => [...current, ...photos]);
	}

	function removeAdded(key: number) {
		const photo = added.find((item) => item.key === key);
		if (photo) {
			URL.revokeObjectURL(photo.preview);
			previews.current.delete(photo.preview);
		}
		setAdded((current) => current.filter((item) => item.key !== key));
		setProblem(null);
	}

	function removeKept(id: number) {
		setKept((current) => current.filter((image) => image.id !== id));
		setProblem(null);
	}

	const changes: PhotoChanges = {
		added: added.map((photo) => photo.file),
		removed: removedPhotoIds(initial, kept),
	};

	return { kept, added, room, problem, add, removeAdded, removeKept, changes };
}

type ListingPhotos = ReturnType<typeof useListingPhotos>;

export default function ListingPhotosField({ photos }: { photos: ListingPhotos }) {
	const tiles = [
		...photos.kept.map((image) => ({
			key: `kept-${image.id}`,
			src: image.image,
			remove: () => photos.removeKept(image.id),
		})),
		...photos.added.map((photo) => ({
			key: `added-${photo.key}`,
			src: photo.preview,
			remove: () => photos.removeAdded(photo.key),
		})),
	];

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		photos.add(Array.from(event.target.files ?? []));
		// Lets the same file be picked again after it is removed.
		event.target.value = "";
	}

	return (
		<fieldset className="space-y-2">
			{/* Styled like the other fields' labels. */}
			<legend className="mb-2 text-label-md text-muted-foreground">Photos</legend>
			<ul className="flex flex-wrap gap-3">
				{tiles.map((tile, index) => (
					<li key={tile.key} className="relative w-20">
						<div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
							{/* Previews are blob: URLs and uploads come from the API's storage. */}
							<Image src={tile.src} alt="" fill unoptimized sizes="80px" className="object-cover" />
						</div>
						{index === 0 && (
							<Text
								as="span"
								variant="label-sm"
								className="absolute inset-x-0 bottom-0 rounded-b-lg bg-neutral-10/60 py-0.5 text-center text-white"
							>
								Cover
							</Text>
						)}
						<IconButton
							type="button"
							variant="outlined"
							size="icon-sm"
							label={`Remove photo ${index + 1}`}
							onClick={tile.remove}
							className="absolute -top-2 -right-2 size-6 shadow-sm [&_svg]:size-3.5"
						>
							<X />
						</IconButton>
					</li>
				))}
				{photos.room > 0 && (
					<li className="w-20">
						<label
							className={cn(
								"flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground transition",
								"hover:border-primary hover:text-primary has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
							)}
						>
							<ImagePlus aria-hidden className="size-5" />
							<Text as="span" variant="label-sm">
								Add
							</Text>
							<input
								type="file"
								accept={PHOTO_TYPES.join(",")}
								multiple
								onChange={handleChange}
								aria-label="Add photos"
								className="sr-only"
							/>
						</label>
					</li>
				)}
			</ul>
			{photos.problem ? (
				<Text variant="body-sm" tone="destructive" role="alert">
					{photos.problem}
				</Text>
			) : (
				<Text variant="body-sm" tone="muted">
					Optional. Up to {MAX_LISTING_PHOTOS} JPEG, PNG or WebP photos, {MAX_PHOTO_MB} MB each. The
					first is the cover students see when browsing.
				</Text>
			)}
		</fieldset>
	);
}
