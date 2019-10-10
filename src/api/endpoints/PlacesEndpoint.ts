import {AxiosInstance} from 'axios';
import IMapObject from '../../interfaces/IMapObject';
import {BaseEndpoint, IDictionary, IEndpoint, PlaceType} from '../common';

export interface IPlacesEndpoint extends IEndpoint<IPlace> {
}

export interface IPlace {
  id?: number;
  name: string;
  LocationId: number;
  type: PlaceType;
  container: string;
  props?: IDictionary;
  MapObject?: IMapObject;
}
export default class PlacesEndpoint extends BaseEndpoint implements IPlacesEndpoint {
  protected route: string = 'places/';

  constructor(api: AxiosInstance) {
    super(api);
  }
}
