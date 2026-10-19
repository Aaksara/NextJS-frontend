import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
}

export default function AuthForm({ title, subtitle, children }: AuthFormProps) {
	return (
		<div className="min-h-screen bg-muted px-4 py-8 md:flex md:items-center md:justify-center">
			<Card className="mx-auto w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">{title}</CardTitle>
					{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
				</CardHeader>
				<CardContent>{children}</CardContent>
			</Card>
		</div>
	);
}
