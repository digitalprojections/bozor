import users from './users'
import advertising from './advertising'
import reports from './reports'
import verifications from './verifications'
const admin = {
    users: Object.assign(users, users),
advertising: Object.assign(advertising, advertising),
reports: Object.assign(reports, reports),
verifications: Object.assign(verifications, verifications),
}

export default admin