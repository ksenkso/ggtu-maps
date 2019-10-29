import {ICoords} from '../utils/Vector';
import IApiClient from './IApiClient';

export default interface IMap {
    app: PIXI.Application;
    api: IApiClient;
    root: HTMLElement;
    getZoom(): number;
    getCoords(): ICoords;
}
