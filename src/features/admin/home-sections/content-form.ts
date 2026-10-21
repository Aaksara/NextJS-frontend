import type { SectionContent } from "@/components/landing/content";
import type { HomeSectionKind } from "@/services/cms.service";

import type { HomeSection } from "./types";

export interface TextField {
	name: string;
	label: string;
	/** The API's limit for the field (`cms/content.py`). */
	maxLength: number;
	multiline?: boolean;
}

export interface ContentForm {
	fields: TextField[];
	/** The section's cards, steps or points, one per `ITEM_POSITIONS`. */
	items?: { noun: string; fields: TextField[] };
}

/** Each position on the page has its own icon and colour, so there are always three. */
export const ITEM_POSITIONS = [0, 1, 2] as const;

const heading = (eyebrowLabel: string): TextField[] => [
	{ name: "eyebrow", label: eyebrowLabel, maxLength: 60 },
	{ name: "title", label: "Title", maxLength: 120 },
	{ name: "description", label: "Description", maxLength: 300, multiline: true },
];

const itemTitle: TextField = { name: "title", label: "Title", maxLength: 60 };
const itemText: TextField = { name: "text", label: "Text", maxLength: 300, multiline: true };

export const contentForms: Record<HomeSectionKind, ContentForm> = {
	hero: {
		fields: heading("Badge"),
		items: { noun: "Point", fields: [{ ...itemTitle, label: "Text" }] },
	},
	how_it_works: {
		fields: heading("Eyebrow"),
		items: {
			noun: "Step",
			fields: [itemTitle, itemText, { name: "note", label: "Note", maxLength: 40 }],
		},
	},
	listing_types: {
		fields: heading("Eyebrow"),
		items: { noun: "Card", fields: [itemTitle, itemText] },
	},
	safety: { fields: heading("Eyebrow"), items: { noun: "Feature", fields: [itemTitle, itemText] } },
	call_to_action: { fields: heading("Eyebrow") },
};

/** Whether the admin has written the section's text, rather than it showing the built-in text. */
export const hasCustomContent = (
	section: HomeSection,
): section is HomeSection & { content: SectionContent } => Object.keys(section.content).length > 0;

/** An item field's input name. It matches the API's error path, e.g. "items.1.text". */
export const itemFieldName = (position: number, field: string) => `items.${position}.${field}`;

/** The content as form values, keyed by input name. */
export function toFormValues(content: SectionContent) {
	const values: Record<string, string> = {
		eyebrow: content.eyebrow,
		title: content.title,
		description: content.description,
	};
	const items = "items" in content ? content.items : [];
	items.forEach((item, index) => {
		for (const [field, value] of Object.entries(item)) values[itemFieldName(index, field)] = value;
	});
	return values;
}

/** Reads a submitted content form back into the API's shape. */
export function readContent(form: FormData, { fields, items }: ContentForm): SectionContent {
	const text = (name: string) => String(form.get(name) ?? "").trim();
	const content: Record<string, unknown> = Object.fromEntries(
		fields.map(({ name }) => [name, text(name)]),
	);
	if (items) {
		content.items = ITEM_POSITIONS.map((position) =>
			Object.fromEntries(
				items.fields.map(({ name }) => [name, text(itemFieldName(position, name))]),
			),
		);
	}
	// The form is built from `contentForms`, whose fields match each section's content type.
	return content as unknown as SectionContent;
}
