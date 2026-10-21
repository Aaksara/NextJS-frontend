import Image from "next/image";
import Link from "next/link";

import { Text } from "@/components/ui/typography";

export default function AdminBrand() {
	return (
		<Link href="/admin" className="flex items-center gap-3">
			<Image
				src="/icons/favicon.png"
				alt=""
				width={36}
				height={36}
				preload
				className="rounded-lg bg-white"
			/>
			<span className="flex flex-col">
				<Text as="span" variant="headline-sm" className="text-primary leading-tight">
					Akshara
				</Text>
				<Text
					as="span"
					variant="label-sm"
					tone="muted"
					className="uppercase tracking-wider leading-tight"
				>
					Super admin
				</Text>
			</span>
		</Link>
	);
}
