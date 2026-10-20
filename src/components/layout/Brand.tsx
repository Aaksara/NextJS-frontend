import Image from "next/image";
import Link from "next/link";

import { Text } from "@/components/ui/typography";

/** Logo and name, linking home. */
export default function Brand() {
	return (
		<Link href="/" className="flex items-center gap-2 text-primary">
			<Image
				src="/icons/favicon.png"
				alt=""
				width={32}
				height={32}
				preload
				className="rounded-full bg-white"
			/>
			<Text as="span" variant="headline-sm">
				Akshara
			</Text>
		</Link>
	);
}
