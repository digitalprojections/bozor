import UserController from './UserController'
import ListingReportController from './ListingReportController'
import VerificationController from './VerificationController'
const Admin = {
    UserController: Object.assign(UserController, UserController),
ListingReportController: Object.assign(ListingReportController, ListingReportController),
VerificationController: Object.assign(VerificationController, VerificationController),
}

export default Admin