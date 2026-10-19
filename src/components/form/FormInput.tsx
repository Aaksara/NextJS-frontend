"use client";

import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/utils";

interface FormInputProps extends ComponentProps<"input"> {
	id: string;
	label: string;
	icon?: ReactNode;
	/** Messages from the API for this field. */
	errors?: string[];
}

export default function FormInput({
	id,
	label,
	icon,
	errors,
	type = "text",
	required = true,
	...props
}: FormInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";

	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<div className="relative">
				{icon && (
					<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
						{icon}
					</span>
				)}
				<Input
					id={id}
					name={id}
					type={isPassword && showPassword ? "text" : type}
					required={required}
					aria-invalid={!!errors?.length}
					className={cn("h-11 rounded-lg", icon && "pl-10", isPassword && "pr-10")}
					{...props}
				/>
				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						aria-label={showPassword ? "Hide password" : "Show password"}
						className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				)}
			</div>
			{errors?.length ? <p className="text-xs text-destructive">{errors.join(" ")}</p> : null}
		</div>
	);
}
