import users from './users'
import verifications from './verifications'
const admin = {
    users: Object.assign(users, users),
verifications: Object.assign(verifications, verifications),
}

export default admin