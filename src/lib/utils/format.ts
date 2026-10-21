const LOCALE = "en-US";

const numberFormat = new Intl.NumberFormat(LOCALE);
const currencyFormat = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "USD" });
const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" });
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium", timeStyle: "short" });
const relativeFormat = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto", style: "narrow" });

export const formatNumber = (value: number) => numberFormat.format(value);

export const formatCurrency = (value: number) => currencyFormat.format(value);

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
