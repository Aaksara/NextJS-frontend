import { TextLink } from "@/components/ui/text-link";
import { Text } from "@/components/ui/typography";

interface AuthFooterProps {
	prompt: string;
	label: string;
	href: string;
}

export default function AuthFooter({ prompt, label, href }: AuthFooterProps) {
	return (
		<Text tone="muted" className="mt-6 text-center">
			{prompt} <TextLink href={href}>{label}</TextLink>
		</Text>
	);
}
