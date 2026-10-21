import { describe, expect, it } from "vitest";

import { builtInHomeContent } from "@/components/landing/content";
import { HOME_SECTIONS } from "@/services/cms.service";

import { contentForms, readContent, toFormValues } from "./content-form";

/** A submitted form holding `values`, as the browser would send it. */
function formWith(values: Record<string, string>) {
	const form = new FormData();
	for (const [name, value] of Object.entries(values)) form.set(name, value);
	return form;
}

describe("content form", () => {
	it.each(HOME_SECTIONS)("round-trips the built-in text of %s", (kind) => {
		const content = builtInHomeContent[kind];

		expect(readContent(formWith(toFormValues(content)), contentForms[kind])).toEqual(content);
	});

	it("names item fields by their path", () =>
		expect(toFormValues(builtInHomeContent.how_it_works)["items.2.note"]).toBe(
			"Payment happens in person",
		));

	it("trims what was typed", () => {
		const values = { ...toFormValues(builtInHomeContent.call_to_action), title: "  Hi  " };

		expect(readContent(formWith(values), contentForms.call_to_action).title).toBe("Hi");
	});
});
