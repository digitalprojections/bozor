import users from './users'
import reports from './reports'
import verifications from './verifications'
const admin = {
    users: Object.assign(users, users),
reports: Object.assign(reports, reports),
verifications: Object.assign(verifications, verifications),
}

export default admin