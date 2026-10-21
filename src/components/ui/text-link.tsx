import Link from "next/link";
import type * as React from "react";

import { textVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

function TextLink({ className, ...props }: React.ComponentProps<typeof Link>) {
	return (
		<Link
			className={cn(
				textVariants({ variant: "label-lg", tone: "primary" }),
				"inline-flex items-center gap-1 underline-offset-4 hover:underline [&_svg]:size-4",
				className,
			)}
			{...props}
		/>
	);
}

export { TextLink };
