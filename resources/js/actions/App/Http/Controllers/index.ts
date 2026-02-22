import MarketplaceController from './MarketplaceController'
import ListingController from './ListingController'
import BidController from './BidController'
import TransactionController from './TransactionController'
import RatingController from './RatingController'
import ProfileController from './ProfileController'
import DashboardController from './DashboardController'
import WatchlistController from './WatchlistController'
import VerificationRequestController from './VerificationRequestController'
import Settings from './Settings'
const Controllers = {
    MarketplaceController: Object.assign(MarketplaceController, MarketplaceController),
ListingController: Object.assign(ListingController, ListingController),
BidController: Object.assign(BidController, BidController),
TransactionController: Object.assign(TransactionController, TransactionController),
RatingController: Object.assign(RatingController, RatingController),
ProfileController: Object.assign(ProfileController, ProfileController),
DashboardController: Object.assign(DashboardController, DashboardController),
WatchlistController: Object.assign(WatchlistController, WatchlistController),
VerificationRequestController: Object.assign(VerificationRequestController, VerificationRequestController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers