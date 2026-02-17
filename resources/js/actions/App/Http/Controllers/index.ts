import MarketplaceController from './MarketplaceController'
import ListingController from './ListingController'
import DashboardController from './DashboardController'
import VerificationRequestController from './VerificationRequestController'
import Settings from './Settings'
const Controllers = {
    MarketplaceController: Object.assign(MarketplaceController, MarketplaceController),
ListingController: Object.assign(ListingController, ListingController),
DashboardController: Object.assign(DashboardController, DashboardController),
VerificationRequestController: Object.assign(VerificationRequestController, VerificationRequestController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers