import { toast } from "sonner";

import { getErrorMessage, getFieldErrors } from "@/lib/utils/page-helpers";

export type FieldErrors = Record<string, string[]>;

/**
 * `onError` for a form's mutation: field errors go next to their fields, and the message,
 * which covers errors that belong to no field, shows as a toast.
 */
export function reportFormError(setErrors: (errors: FieldErrors) => void) {
	return (error: unknown) => {
		setErrors(getFieldErrors(error));
		toast.error(getErrorMessage(error));
	};
}
