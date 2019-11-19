import AuthEndpoint from "../api/endpoints/AuthEndpoint";

export default class UserInfo {
  _user = {};
  /**
   *
   * @param {User} value
   */
  set user(value) {
    if (value) {
      this._user = value;
      this.api.token = value.token;
    }
  }

  /**
   *
   * @return {User}
   */
  get user() {
    return this._user;
  }

  get isRootUser() {
    return this._user.role === 'root';
  }

  /**
   *
   * @param {ApiClient} api
   */
  constructor(api) {
    this.api = api;
    this.auth = new AuthEndpoint(this.api.getTransport());
  }

  /**
   *
   * @throws Error
   * @param {{login: string, password: string}} user
   * @return {Promise<User>}
   */
  async login(user) {
    const data = await this.auth.authenticate(user.login, user.password);
    this.user = data;
    return data;
  }

  /**
   *
   * @return {Promise<boolean>}
   */
  async isLoggedIn() {
    if (this.user.token) {
     try {
       return await this.auth.checkToken(this.user.token);
     } catch (e) {
       return false;
     }
    }
  }

  logout() {
    this._user.token = null;
  }
}
