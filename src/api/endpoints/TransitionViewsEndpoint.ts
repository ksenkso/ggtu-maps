import {AxiosInstance} from 'axios';
import {BaseEndpoint, IEndpoint} from '../common';

export interface ITransitionView {
  id?: number;
  container: string;
  TransitionId: number;
  LocationId: number;
}

export default class TransitionViewsEndpoint extends BaseEndpoint implements IEndpoint<ITransitionView> {
  protected route: string = 'transition-views/';
  constructor(api: AxiosInstance) {
    super(api);
  }
}
