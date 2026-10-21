import CampusListings from "./CampusListings";
import ExchangesPanel from "./ExchangesPanel";
import MeetupSpots from "./MeetupSpots";
import ProfileSummary from "./ProfileSummary";

export default function OverviewView() {
	return (
		<>
			<ProfileSummary />
			<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
				<ExchangesPanel />
				<MeetupSpots />
			</div>
			<CampusListings />
		</>
	);
}
