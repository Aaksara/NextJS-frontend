import { cn } from "@/lib/utils/utils";

const tones = [
	"bg-primary-container text-primary-container-foreground",
	"bg-secondary-container text-secondary-container-foreground",
	"bg-tertiary-container text-tertiary-container-foreground",
	"bg-success-container text-success-container-foreground",
];

function initials(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}

/** Same name, same color, so a person is recognisable across lists. */
function toneFor(name: string) {
	let hash = 0;
	for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
	return tones[hash % tones.length];
}

const sizes = {
	sm: "size-8 text-label-sm",
	md: "size-10 text-label-md",
	lg: "size-14 text-headline-sm",
};

interface AvatarProps {
	name: string;
	size?: keyof typeof sizes;
	className?: string;
}

/** Initials in a colored circle. Decorative: the name is always shown next to it. */
function Avatar({ name, size = "md", className }: AvatarProps) {
	return (
		<span
			aria-hidden
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
				sizes[size],
				toneFor(name),
				className,
			)}
		>
			{initials(name)}
		</span>
	);
}

export { Avatar };
