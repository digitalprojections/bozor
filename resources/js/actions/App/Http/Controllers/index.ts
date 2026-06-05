import LocaleController from './LocaleController'
import Auth from './Auth'
import SitemapController from './SitemapController'
import MarketplaceController from './MarketplaceController'
import WatchlistController from './WatchlistController'
import ListingReportController from './ListingReportController'
import ListingMessageController from './ListingMessageController'
import VerificationRequestController from './VerificationRequestController'
import ListingController from './ListingController'
import BidController from './BidController'
import TransactionController from './TransactionController'
import RatingController from './RatingController'
import DashboardController from './DashboardController'
import Settings from './Settings'
import Admin from './Admin'
import ProfileController from './ProfileController'
const Controllers = {
    LocaleController: Object.assign(LocaleController, LocaleController),
Auth: Object.assign(Auth, Auth),
SitemapController: Object.assign(SitemapController, SitemapController),
MarketplaceController: Object.assign(MarketplaceController, MarketplaceController),
WatchlistController: Object.assign(WatchlistController, WatchlistController),
ListingReportController: Object.assign(ListingReportController, ListingReportController),
ListingMessageController: Object.assign(ListingMessageController, ListingMessageController),
VerificationRequestController: Object.assign(VerificationRequestController, VerificationRequestController),
ListingController: Object.assign(ListingController, ListingController),
BidController: Object.assign(BidController, BidController),
TransactionController: Object.assign(TransactionController, TransactionController),
RatingController: Object.assign(RatingController, RatingController),
DashboardController: Object.assign(DashboardController, DashboardController),
Settings: Object.assign(Settings, Settings),
Admin: Object.assign(Admin, Admin),
ProfileController: Object.assign(ProfileController, ProfileController),
}

export default Controllers