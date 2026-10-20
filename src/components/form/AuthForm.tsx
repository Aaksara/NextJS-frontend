import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Text, textVariants } from "@/components/ui/typography";

interface AuthFormProps {
	title: string;
	subtitle?: string;
	/** Link in the top bar, e.g. to switch between sign in and registration. */
	headerLink?: { prompt: string; label: string; href: string };
	children: ReactNode;
}

const steps = [
	{ label: "List", text: "Add a book by its ISBN to sell, swap or donate." },
	{ label: "Chat", text: "Agree on the condition and a time with the other student." },
	{ label: "Meet", text: "Exchange on campus and pay in person." },
];

export default function AuthForm({ title, subtitle, headerLink, children }: AuthFormProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
				<Link href="/" className="flex items-center gap-2.5">
					<Image
						src="/icons/favicon.png"
						alt=""
						width={36}
						height={36}
						priority
						className="rounded-full dark:bg-white"
					/>
					<Text as="span" variant="headline-sm">
						Akshara
					</Text>
				</Link>
				{headerLink && (
					<Text variant="body-md" tone="muted">
						<span className="hidden sm:inline">{headerLink.prompt} </span>
						<Link
							href={headerLink.href}
							className={textVariants({
								variant: "label-lg",
								tone: "primary",
								className: "hover:underline",
							})}
						>
							{headerLink.label}
						</Link>
					</Text>
				)}
			</header>

			<div className="flex flex-1 lg:p-3 lg:pt-0">
				<main className="flex flex-1 justify-center px-4 pt-8 pb-16 sm:px-8 lg:items-center lg:pt-0">
					<div className="w-full max-w-sm">
						<Text as="h1" variant="headline-md">
							{title}
						</Text>
						{subtitle && (
							<Text variant="body-md" tone="muted" className="mt-2">
								{subtitle}
							</Text>
						)}
						<div className="mt-8">{children}</div>
					</div>
				</main>

				<aside className="hidden w-[44%] max-w-xl flex-col justify-between rounded-2xl bg-panel p-12 text-panel-foreground lg:flex">
					<Image
						src="/icons/favicon.png"
						alt="Akshara logo"
						width={64}
						height={64}
						className="rounded-full bg-white p-1"
					/>

					<div>
						<Text variant="headline-lg" className="max-w-md">
							Pass your textbooks on to the next student.
						</Text>
						<dl className="mt-10 divide-y divide-panel-foreground/15 border-y border-panel-foreground/15">
							{steps.map(({ label, text }) => (
								<div key={label} className="flex gap-6 py-4">
									<Text as="dt" variant="label-lg" className="w-12 shrink-0 text-panel-accent">
										{label}
									</Text>
									<Text as="dd" variant="body-md" className="text-panel-muted">
										{text}
									</Text>
								</div>
							))}
						</dl>
					</div>

					<Text variant="body-md" className="text-panel-muted">
						Open to students with a university email address.
					</Text>
				</aside>
			</div>
		</div>
	);
}
