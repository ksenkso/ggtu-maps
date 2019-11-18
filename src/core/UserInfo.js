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
   * @param {AxiosInstance} api
   */
  constructor(api) {
    this.api = api;
    this.auth = new AuthEndpoint(this.api);
  }

  /**
   *
   * @return {Promise<boolean>}
   */
  async isLoggedIn() {
    return this.user.token && await this.auth.checkToken(this.user.token);
  }

  logout() {
    this._user.token = null;
  }
}
