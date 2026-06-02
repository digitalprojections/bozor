import LocaleController from './LocaleController'
import Auth from './Auth'
import SitemapController from './SitemapController'
import MarketplaceController from './MarketplaceController'
import WatchlistController from './WatchlistController'
import VerificationRequestController from './VerificationRequestController'
import ListingController from './ListingController'
import BidController from './BidController'
import TransactionController from './TransactionController'
import RatingController from './RatingController'
import DashboardController from './DashboardController'
import Settings from './Settings'
import ProfileController from './ProfileController'
const Controllers = {
    LocaleController: Object.assign(LocaleController, LocaleController),
Auth: Object.assign(Auth, Auth),
SitemapController: Object.assign(SitemapController, SitemapController),
MarketplaceController: Object.assign(MarketplaceController, MarketplaceController),
WatchlistController: Object.assign(WatchlistController, WatchlistController),
VerificationRequestController: Object.assign(VerificationRequestController, VerificationRequestController),
ListingController: Object.assign(ListingController, ListingController),
BidController: Object.assign(BidController, BidController),
TransactionController: Object.assign(TransactionController, TransactionController),
RatingController: Object.assign(RatingController, RatingController),
DashboardController: Object.assign(DashboardController, DashboardController),
Settings: Object.assign(Settings, Settings),
ProfileController: Object.assign(ProfileController, ProfileController),
}

export default Controllers