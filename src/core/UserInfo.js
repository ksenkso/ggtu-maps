import ApiClient from '../api/ApiClient';

export default class UserInfo {
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

  /**
   *
   * @param {ApiClient} api
   */
  constructor(api) {
    this.api = api;
  }

  /**
   *
   * @return {Promise<null|{user_id: number, iat: number, exp: number, text: string}>}
   */
  async getTokenInfo() {

    const api = this.api.getTransport();
    const response = await api.get('/users/tokenInfo');
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  }
}
