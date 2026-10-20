export type BannerPlacement = "hero" | "promotion" | "footer";

export type BannerStatus = "draft" | "published";

/** As returned by `/api/admin/banners/`. */
export interface Banner {
	id: number;
	title: string;
	target_url: string;
	/** Absolute URL of the uploaded image. */
	image: string;
	image_width: number | null;
	image_height: number | null;
	alt_text: string;
	placement: BannerPlacement;
	status: BannerStatus;
	position: number;
	updated_at: string;
}
