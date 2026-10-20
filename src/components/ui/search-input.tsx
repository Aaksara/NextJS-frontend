import { Search } from "lucide-react";
import type * as React from "react";

import { IconInput } from "@/components/ui/icon-input";

function SearchInput({ placeholder = "Search", ...props }: React.ComponentProps<"input">) {
	return (
		<IconInput
			type="search"
			startIcon={<Search />}
			placeholder={placeholder}
			aria-label={placeholder}
			{...props}
		/>
	);
}

export { SearchInput };
