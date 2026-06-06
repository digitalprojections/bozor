import UserController from './UserController'
import AdvertisingController from './AdvertisingController'
import ListingReportController from './ListingReportController'
import VerificationController from './VerificationController'
const Admin = {
    UserController: Object.assign(UserController, UserController),
AdvertisingController: Object.assign(AdvertisingController, AdvertisingController),
ListingReportController: Object.assign(ListingReportController, ListingReportController),
VerificationController: Object.assign(VerificationController, VerificationController),
}

export default Admin