import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

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
					<span className="text-lg font-semibold tracking-tight">Akshara</span>
				</Link>
				{headerLink && (
					<p className="text-sm text-muted-foreground">
						<span className="hidden sm:inline">{headerLink.prompt} </span>
						<Link href={headerLink.href} className="font-medium text-primary hover:underline">
							{headerLink.label}
						</Link>
					</p>
				)}
			</header>

			<div className="flex flex-1 lg:p-3 lg:pt-0">
				<main className="flex flex-1 justify-center px-4 pt-8 pb-16 sm:px-8 lg:items-center lg:pt-0">
					<div className="w-full max-w-sm">
						<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
						{subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
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
						<p className="max-w-md text-3xl font-semibold leading-snug tracking-tight">
							Pass your textbooks on to the next student.
						</p>
						<dl className="mt-10 divide-y divide-panel-foreground/15 border-y border-panel-foreground/15">
							{steps.map(({ label, text }) => (
								<div key={label} className="flex gap-6 py-4 text-sm">
									<dt className="w-12 shrink-0 font-medium text-panel-accent">{label}</dt>
									<dd className="text-panel-muted">{text}</dd>
								</div>
							))}
						</dl>
					</div>

					<p className="text-sm text-panel-muted">
						Open to students with a university email address.
					</p>
				</aside>
			</div>
		</div>
	);
}
