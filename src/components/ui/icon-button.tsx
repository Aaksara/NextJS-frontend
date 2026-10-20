import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

type IconButtonProps = Omit<ButtonProps, "size" | "aria-label"> & {
	/** Accessible name. Required because the button has no visible text. */
	label: string;
	size?: "icon" | "icon-sm";
};

/** Round button showing only an icon. Pass `className="rounded-md"` for a square one. */
function IconButton({ label, size = "icon", className, ...props }: IconButtonProps) {
	return (
		<Button
			aria-label={label}
			title={label}
			size={size}
			className={cn("rounded-full", className)}
			{...props}
		/>
	);
}

export { IconButton };
