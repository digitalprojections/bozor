import UserController from './UserController'
import VerificationController from './VerificationController'
const Admin = {
    UserController: Object.assign(UserController, UserController),
VerificationController: Object.assign(VerificationController, VerificationController),
}

export default Admin