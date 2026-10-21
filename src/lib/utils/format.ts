const LOCALE = "en-US";

const numberFormat = new Intl.NumberFormat(LOCALE);
// Nepali rupees, grouped the local way (1,00,000), with paisa only when there are some.
const rupeeFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const rupeePaisaFormat = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" });
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium", timeStyle: "short" });
const relativeFormat = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto", style: "narrow" });

export const formatNumber = (value: number) => numberFormat.format(value);

/** "1 listing", "1,204 listings". For nouns that take an "s" in the plural. */
export const formatCount = (count: number, noun: string) =>
	`${formatNumber(count)} ${count === 1 ? noun : `${noun}s`}`;

/** How prices are marked, e.g. in a field label: "Price (Rs.)". */
export const CURRENCY_SYMBOL = "Rs.";

/** "Rs. 1,450", "Rs. 1,00,000", "Rs. 99.50". */
export function formatCurrency(value: number) {
	const format = Number.isInteger(value) ? rupeeFormat : rupeePaisaFormat;
	return `${CURRENCY_SYMBOL} ${format.format(value)}`;
}

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso));

const units: [Intl.RelativeTimeFormatUnit, number][] = [
	["year", 365 * 24 * 60 * 60],
	["month", 30 * 24 * 60 * 60],
	["day", 24 * 60 * 60],
	["hour", 60 * 60],
	["minute", 60],
];

/** "2d ago", "3h ago", "now". */
export function formatRelativeTime(iso: string, now: Date = new Date()) {
	const seconds = (new Date(iso).getTime() - now.getTime()) / 1000;
	for (const [unit, size] of units) {
		if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit);
	}
	return relativeFormat.format(0, "second");
}

/**
 * `date` as a `datetime-local` input value: the browser's local time, to the minute, e.g.
 * "2026-10-21T14:30".
 */
export function toDateTimeInputValue(date: Date) {
	const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
	return local.toISOString().slice(0, 16);
}
