/**
 * @typedef {{user_id: number, iat: number, exp: number, text: string}} TokenInfo
 */
import ApiClient from '../api/ApiClient';

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
  }

  /**
   * Gets token info. Token is sent in Authorization header.
   *
   * @return {Promise<TokenInfo|null>}
   */
  async getTokenInfo() {
    const api = this.api.getTransport();
    const response = await api.get('/users/tokenInfo');
    if (response.status === 200) {
      return /**@type TokenInfo */response.data;
    } else {
      return null;
    }
  }

  /**
   *
   * @throws Error
   * @return {boolean}
   */
  async checkToken(token) {
    const api = this.api.getTransport();
    const response = await api.get('auth', {params: {token}});
    if (response && response.data.ok) {
      this._user.token = token;
      return true;
    }
    return false;
  }

  /**
   *
   * @throws Error
   * @return {Promise<User|null>}
   */
  async authenticate(login, password) {
    const api = this.api.getTransport();
    const response = await api.post('login', {login, password});
    if (response) {
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      this.token = response.data.token;
      this.user = /**@type {User} */response.data;
      return /**@type {User} */response.data;
    } else {
      return null;
    }
  }

  /**
   *
   * @return {Promise<boolean>}
   */
  isLoggedIn() {
    return this.user.token && this.api.checkToken(this.user.token);
  }

  logout() {
    this._user.token = null;
  }
}
