"use client";

import { LogOut, Server } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

import AdminBrand from "./AdminBrand";
import { useAdminSession, useSignOut } from "./admin-session";
import ConsoleNav from "./ConsoleNav";

const environment = process.env.NEXT_PUBLIC_APP_ENV ?? "development";

export default function TopBar() {
	const { data: admin } = useAdminSession();
	const signOut = useSignOut();

	return (
		<header className="sticky top-0 z-30 border-b bg-card/85 backdrop-blur">
			<div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
				<div className="lg:hidden">
					<AdminBrand />
				</div>
				<Badge
					tone={environment === "production" ? "secondary" : "neutral"}
					className="hidden capitalize sm:inline-flex"
				>
					<Server />
					{environment}
				</Badge>
				{admin && (
					<div className="ml-auto flex items-center gap-3">
						<Avatar name={admin.full_name} size="sm" />
						<div className="hidden text-right sm:block">
							<Text variant="label-md">{admin.full_name}</Text>
							<Text variant="body-sm" tone="muted">
								Super admin
							</Text>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => signOut.mutate()}
							disabled={signOut.isPending}
						>
							<LogOut />
							Sign out
						</Button>
					</div>
				)}
			</div>
			<div className="border-t px-4 py-2 sm:px-6 lg:hidden">
				<ConsoleNav orientation="horizontal" />
			</div>
		</header>
	);
}
