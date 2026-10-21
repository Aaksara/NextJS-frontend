import CampusListings from "./CampusListings";
import ExchangesPanel from "./ExchangesPanel";
import ProfileSummary from "./ProfileSummary";

export default function OverviewView() {
	return (
		<>
			<ProfileSummary />
			<ExchangesPanel />
			<CampusListings />
		</>
	);
}
