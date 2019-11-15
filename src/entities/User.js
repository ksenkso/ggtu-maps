export default class User {
    constructor({login, password, token = null}) {
        this.login = login;
        this.password = password;
        this.token = token;
    }
}
