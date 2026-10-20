import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils/utils";

const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-label-lg transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				primary: "bg-primary text-primary-foreground hover:bg-primary/90",
				secondary: "bg-muted text-foreground hover:bg-accent",
				tertiary: "bg-tertiary text-tertiary-foreground hover:bg-tertiary/90",
				inverted: "bg-inverse text-inverse-foreground hover:bg-inverse/90",
				outlined: "border border-input bg-card text-foreground hover:bg-muted",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				sm: "h-8 px-3",
				md: "h-9 px-4",
				lg: "h-11 rounded-lg px-6",
				"icon-sm": "size-8",
				icon: "size-9",
				/** No box, for a `link` button inside a sentence. */
				inline: "h-auto p-0",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	};

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
	const Comp = asChild ? Slot : "button";
	return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, type ButtonProps, buttonVariants };
