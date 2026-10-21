export interface MeetupLocation {
	id: number;
	name: string;
	description: string;
	/** Retired spots stay for past exchanges but cannot be picked for new ones. */
	is_active: boolean;
}

export type MeetupLocationInput = Omit<MeetupLocation, "id">;

export interface CampusSettings {
	/** Only these email domains, and their subdomains, may register. */
	email_domains: string[];
}
