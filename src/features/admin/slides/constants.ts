import type { SliderKey } from "@/services/cms.service";

export const sliders: { key: SliderKey; label: string; description: string }[] = [
	{
		key: "home_hero",
		label: "Home page: top",
		description: "The slider beside the headline at the top of the home page.",
	},
	{
		key: "home_safety",
		label: "Home page: safety",
		description: "The slider in the home page's Safety section.",
	},
	{
		key: "sign_in",
		label: "Sign-in and sign-up pages",
		description: "The panel beside the forms on wide screens: sign in, sign up and password pages.",
	},
];
