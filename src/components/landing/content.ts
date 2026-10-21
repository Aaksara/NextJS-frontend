/** The heading every home page section has. Mirrors `cms/content.py` in the backend. */
export interface SectionText {
	eyebrow: string;
	title: string;
	description: string;
}

export interface Point {
	title: string;
}

export interface Card extends Point {
	text: string;
}

export interface Step extends Card {
	note: string;
}

/**
 * The editable text of each section. Sections with cards or steps always have three, since
 * each position has its own icon and colour.
 */
export interface HomeContent {
	hero: SectionText & { items: Point[] };
	how_it_works: SectionText & { items: Step[] };
	listing_types: SectionText & { items: Card[] };
	safety: SectionText & { items: Card[] };
	call_to_action: SectionText;
}

export type SectionContent = HomeContent[keyof HomeContent];

/**
 * Pairs each item with the look of its position (icon, colour). Items past the last look
 * are left out, so the page never shows one without its icon.
 */
export function withPositionStyles<Item, Style>(items: readonly Item[], styles: readonly Style[]) {
	return items.flatMap((item, index) => {
		const style = styles[index];
		return style ? [{ ...item, ...style }] : [];
	});
}

export const builtInHomeContent: HomeContent = {
	hero: {
		eyebrow: "Student-to-student textbook exchange",
		title: "Buy, swap and donate textbooks on campus.",
		description:
			"Pass on the books from last semester and find the ones you need for the next. Meet a fellow student at an approved spot on campus to hand them over.",
		items: [
			{ title: "University email required" },
			{ title: "Sell, swap or donate" },
			{ title: "Meet at approved campus spots" },
		],
	},
	how_it_works: {
		eyebrow: "Three steps",
		title: "How Akshara works",
		description: "Trade course books directly with other students at your university.",
		items: [
			{
				title: "List or find a book",
				text: "Add the book's title, its condition and your price, and classmates can request it straight away. Looking for one? Search by title, author or course code.",
				note: "Search by course code",
			},
			{
				title: "Agree on the details",
				text: "Send the owner a request with your offer, or one of your own books for a swap, and message each other to settle the details.",
				note: "Built-in chat",
			},
			{
				title: "Meet on campus",
				text: "Hand the book over at an approved spot on campus, at a time you both agree on. Check its condition before you pay.",
				note: "Payment happens in person",
			},
		],
	},
	listing_types: {
		eyebrow: "Your books, your choice",
		title: "Sell, swap or donate",
		description:
			"Each listing states the book's condition, from new to poor, and can include photos.",
		items: [
			{
				title: "Sell",
				text: "Set your own price and get some money back for the books you have finished with.",
			},
			{
				title: "Swap",
				text: "Offer one of your own listed books in exchange for the one you need, with no money involved.",
			},
			{
				title: "Donate",
				text: "Give a book away for free to a student who needs it for their course.",
			},
		],
	},
	safety: {
		eyebrow: "Built for your campus",
		title: "Trade only with students from your university.",
		description:
			"Akshara isn't open to the public. Everyone you meet signed up with a university email address.",
		items: [
			{
				title: "University email sign-up",
				text: "Registration only accepts your university's email domains, and you verify the address before you can sign in.",
			},
			{
				title: "Approved meeting spots",
				text: "Handovers take place at campus locations approved by the Akshara team, at a time you both agree on.",
			},
			{
				title: "Check before you pay",
				text: "You see the book in person before any money changes hands, so you know it matches the listing.",
			},
		],
	},
	call_to_action: {
		eyebrow: "Join Akshara",
		title: "Got books from last semester?",
		description:
			"Create an account with your university email to list them, or to find the books for your next course.",
	},
};
