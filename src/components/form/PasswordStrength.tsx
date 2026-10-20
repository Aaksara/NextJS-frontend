import { Circle, CircleCheck } from "lucide-react";

import { SegmentedProgress } from "@/components/ui/progress";
import { Text } from "@/components/ui/typography";

/**
 * The first two mirror the server's length and numeric validators; length is what
 * makes a password strong. The server also rejects common passwords, which it alone checks.
 */
const rules = [
	{ label: "8+ characters", test: (password: string) => password.length >= 8 },
	{ label: "Not only numbers", test: (password: string) => !/^\d*$/.test(password) },
	{ label: "12+ characters", test: (password: string) => password.length >= 12 },
];

function getStrength(met: number) {
	if (met === rules.length) return { label: "Strong", tone: "primary" } as const;
	if (met === 2) return { label: "Medium", tone: "secondary" } as const;
	return { label: "Weak", tone: "destructive" } as const;
}

export default function PasswordStrength({ password }: { password: string }) {
	const results = rules.map(({ label, test }) => ({ label, met: test(password) }));
	const metCount = results.filter(({ met }) => met).length;
	const strength = getStrength(metCount);

	return (
		<div className="space-y-2">
			<SegmentedProgress
				steps={rules.length}
				value={metCount}
				tone={strength.tone}
				aria-label="Password strength"
			/>
			<div className="flex items-start justify-between gap-3">
				<ul className="flex flex-wrap gap-x-3 gap-y-1">
					{results.map(({ label, met }) => (
						<li key={label} className="flex items-center gap-1">
							{met ? (
								<CircleCheck className="size-3.5 text-primary" />
							) : (
								<Circle className="size-3.5 text-muted-foreground" />
							)}
							<Text as="span" variant="body-sm" tone={met ? "foreground" : "muted"}>
								<span className="sr-only">{met ? "Done: " : "Missing: "}</span>
								{label}
							</Text>
						</li>
					))}
				</ul>
				<Text as="span" variant="label-sm" tone="muted" aria-live="polite" className="shrink-0">
					{password && strength.label}
				</Text>
			</div>
		</div>
	);
}
