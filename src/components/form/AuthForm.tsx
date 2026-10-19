import { BookOpen, HeartHandshake, Repeat, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface AuthFormProps {
	title: string;
	subtitle?: string;
	/** Small label above the title. */
	eyebrow?: string;
	/** Link in the top bar, e.g. to switch between sign in and registration. */
	headerLink?: { prompt: string; label: string; href: string };
	children: ReactNode;
}

const features = [
	{ icon: BookOpen, text: "Buy used course books for less" },
	{ icon: Repeat, text: "Swap the ones you have finished with" },
	{ icon: HeartHandshake, text: "Donate to students who need them" },
];

export default function AuthForm({
	title,
	subtitle,
	eyebrow,
	headerLink,
	children,
}: AuthFormProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-8 lg:h-20 lg:px-16">
				<Link href="/" className="flex items-center gap-3">
					<span className="grid size-9 place-items-center rounded-lg bg-panel text-lg text-panel-accent lg:size-10">
						अ
					</span>
					<span className="leading-tight">
						<span className="block font-serif text-lg tracking-[0.12em]">AKSARA</span>
						<span className="hidden text-xs text-brand sm:block">अक्षर</span>
					</span>
				</Link>
				{headerLink && (
					<div className="flex items-center gap-3 text-sm">
						<span className="hidden text-muted-foreground sm:inline">{headerLink.prompt}</span>
						<Button asChild variant="outline">
							<Link href={headerLink.href}>{headerLink.label}</Link>
						</Button>
					</div>
				)}
			</header>

			<div className="flex flex-1 lg:p-4 lg:pl-0">
				<main className="flex flex-1 justify-center px-4 py-10 sm:px-8 lg:items-center">
					<div className="w-full max-w-md">
						{eyebrow && (
							<p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">
								{eyebrow}
							</p>
						)}
						<h1 className="font-serif text-3xl sm:text-4xl">{title}</h1>
						{subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
						<div className="mt-8">{children}</div>
						<p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
							<ShieldCheck size={14} className="text-emerald-600" />
							Your account information is securely protected
						</p>
					</div>
				</main>

				<aside className="relative hidden w-[46%] max-w-2xl flex-col justify-between overflow-hidden rounded-2xl bg-panel p-10 text-panel-foreground lg:flex">
					<span
						aria-hidden
						className="pointer-events-none absolute -bottom-24 -right-10 select-none text-[28rem] leading-none text-panel-foreground/5"
					>
						अ
					</span>
					<p className="text-xs font-semibold uppercase tracking-widest text-panel-muted">
						AKSARA student marketplace
					</p>

					<div className="relative">
						<p className="font-serif text-4xl leading-tight xl:text-5xl">
							Everything for your semester, from students on your campus.
						</p>
						<ul className="mt-10 space-y-4">
							{features.map(({ icon: Icon, text }) => (
								<li key={text} className="flex items-center gap-3 text-panel-muted">
									<span className="grid size-9 place-items-center rounded-lg border border-panel-foreground/15 text-panel-accent">
										<Icon size={16} />
									</span>
									{text}
								</li>
							))}
						</ul>
					</div>

					<p className="relative border-t border-panel-foreground/10 pt-6 text-sm text-panel-muted">
						Open to verified university email addresses only.
					</p>
				</aside>
			</div>
		</div>
	);
}
