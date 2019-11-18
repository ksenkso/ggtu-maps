import BaseEndpoint from '../common';
import TransitionViewsEndpoint from './TransitionViewsEndpoint';

export default class TransitionsEndpoint extends BaseEndpoint {
  route = 'transitions/';

  /**
   *
   * @param {AxiosInstance} api
   */
  constructor(api) {
    super(api);
    this.views = new TransitionViewsEndpoint(api);
  }
}
