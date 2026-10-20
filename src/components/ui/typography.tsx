import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { typeScale } from "@/lib/theme/type-scale";
import { cn } from "@/lib/utils/utils";

/** Also usable on its own, e.g. `<Link className={textVariants({ variant: "label-lg" })}>`. */
const textVariants = cva("", {
	variants: {
		variant: typeScale,
		tone: {
			foreground: "text-foreground",
			muted: "text-muted-foreground",
			primary: "text-primary",
			destructive: "text-destructive",
		},
	},
	defaultVariants: { variant: "body-md" },
});

type TextElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "strong" | "dt" | "dd" | "li";

type TextProps = React.HTMLAttributes<HTMLElement> &
	VariantProps<typeof textVariants> & {
		/** Element to render, chosen for meaning. The variant only sets the look. */
		as?: TextElement;
	};

/** Text in one of the design system's type styles. Without `tone`, color is inherited. */
function Text({ as: Comp = "p", variant, tone, className, ...props }: TextProps) {
	return <Comp className={cn(textVariants({ variant, tone }), className)} {...props} />;
}

export { Text, textVariants };
