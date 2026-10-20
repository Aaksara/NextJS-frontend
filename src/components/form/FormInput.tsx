"use client";

import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { IconInput } from "@/components/ui/icon-input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";

interface FormInputProps extends ComponentProps<"input"> {
	id: string;
	label: string;
	icon?: ReactNode;
	/** Shown at the right of the label, e.g. a "Forgot password?" link. */
	labelAside?: ReactNode;
	/** Messages from the API for this field. */
	errors?: string[];
}

export default function FormInput({
	id,
	label,
	icon,
	labelAside,
	errors,
	type = "text",
	required = true,
	...props
}: FormInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";
	const errorId = `${id}-error`;
	const hasErrors = !!errors?.length;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label htmlFor={id}>{label}</Label>
				{labelAside}
			</div>
			<IconInput
				id={id}
				name={id}
				type={isPassword && showPassword ? "text" : type}
				required={required}
				aria-invalid={hasErrors}
				aria-describedby={hasErrors ? errorId : undefined}
				className="h-10"
				startIcon={icon}
				endAdornment={
					isPassword && (
						<IconButton
							type="button"
							variant="ghost"
							size="icon-sm"
							label={showPassword ? "Hide password" : "Show password"}
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeOff /> : <Eye />}
						</IconButton>
					)
				}
				{...props}
			/>
			{hasErrors && (
				<Text id={errorId} variant="body-sm" tone="destructive">
					{errors.join(" ")}
				</Text>
			)}
		</div>
	);
}
