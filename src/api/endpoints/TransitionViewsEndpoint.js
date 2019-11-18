import BaseEndpoint from '../common';

export default class TransitionViewsEndpoint extends BaseEndpoint {
  route = 'transition-views/';

  /**
   *
   * @param {AxiosInstance} api
   */
  constructor(api) {
    super(api);
  }
}
