import ApiClient from '../api/ApiClient';
import {ILocation} from '../interfaces/ILocation';
import IMap from '../interfaces/IMap';
import IRenderer from '../interfaces/IRenderer';
import EventEmitter from './EventEmitter';

export default class Renderer extends EventEmitter implements IRenderer {
    private _app: PIXI.Application;
    private _api = ApiClient.getInstance();
    constructor(private map: IMap) {
        super();
        this._app = map.app;
        this.init()
    }

    private init() {

    }

    public async renderLocation(location: ILocation) {

    }
}
