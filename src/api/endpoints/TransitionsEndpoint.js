import BaseEndpoint from '../common';
import TransitionViewsEndpoint from './TransitionViewsEndpoint';

export default class TransitionsEndpoint extends BaseEndpoint {
  route = 'transitions/';
  constructor(api) {
    super(api);
    this.views = new TransitionViewsEndpoint(api);
  }
}
