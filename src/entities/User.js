/**
 * @class User
 */
export default class User {
    constructor({login, password, role, token = null}) {
        this.login = login;
        this.password = password;
        this.role = role;
        this.token = token;
    }
}
