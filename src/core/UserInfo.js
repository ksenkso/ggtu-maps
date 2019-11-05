import ApiClient from '../api/ApiClient';

export default class UserInfo {
  set user(value) {
    if (value) {
      this._user = value;
      this.api.token = value.token;
    }
  }

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
