import IApiClient from '../interfaces/IApiClient';
import {ILocation} from '../interfaces/ILocation';
import IMap from '../interfaces/IMap';
import IRenderer from '../interfaces/IRenderer';
import {assignOptions} from '../utils/common';
import * as PIXI from 'pixi.js';
import ApiClient from '../api/ApiClient';
import {ICoords} from '../utils/Vector';
import EventEmitter from './EventEmitter';
import Renderer from './Renderer';

export interface ISceneOptions {
    root: HTMLElement,
    apiBase: string;
    apiToken?: string;
    startLocationId?: number;
}

export default class Map extends EventEmitter implements IMap {
    get app(): PIXI.Application {
        return this._app;
    }

    get api(): IApiClient {
        return this._api;
    }

    public root: HTMLElement;

    private _currentLocation: ILocation;
    private readonly _app: PIXI.Application;
    private _apiBase: string;
    private _apiToken?: string;
    private readonly _api: IApiClient;
    private readonly _renderer: IRenderer;

    constructor(options: ISceneOptions) {
        super();
        assignOptions(this, options);
        // 1. init a PIXI app, get ready to load a location,
        this._app = new PIXI.Application();
        // 2. to do that, create an API instance.
        this._api = ApiClient.getInstance();
        // 3. initiate renderer
        this._renderer = new Renderer(this);
        this.emit('map-ready');
        this.init(options).then(() => this.emit('map-loaded'));
    }

    private async init(options: ISceneOptions) {

        // now the map is ready to render things. fire `map-ready` event
        // 4. get root location or one specified in constructor options
        let location: ILocation;
        if (options.startLocationId) {
            location = await this._api.locations.get(options.startLocationId);
        } else {
            location = await this._api.locations.getRoot();
        }
        // 5. render the location
        this.setLocation(location);
    }

    public setLocation(location: ILocation) {
        this._currentLocation = location;
        this._renderer.renderLocation(location)
            .then(() => this.emit('location-loaded'));
        // when the map is rendered, fire `map-loaded`
    }

    public getLocation(): ILocation {
        return this._currentLocation;
    }

    getCoords(): ICoords {
        return undefined;
    }

    getZoom(): number {
        return ;
    }
}
