import {Viewport} from 'pixi-viewport';
import ApiClient from '../api/ApiClient';
import {ILocation} from '../interfaces/ILocation';
import IMap from '../interfaces/IMap';
import IRenderer from '../interfaces/IRenderer';
import EventEmitter from './EventEmitter';

export default class Renderer extends EventEmitter implements IRenderer {
    private _app: PIXI.Application;
    private _api = ApiClient.getInstance();
    private _viewport: Viewport;

    constructor(private _map: IMap) {
        super();
        this._app = _map.app;
        this.init();
    }

    public async renderLocation(location: ILocation) {
        const map = await this._api.locations.getMap({
            locationId: location.id,
            zoom: this._viewport.scale.x,
            x: this._viewport.center.x,
            y: this._viewport.center.y,
        });
        console.log(map);
    }

    private init() {

        this._viewport = new Viewport({
            screenWidth: this._map.root.clientWidth,
            screenHeight: this._map.root.clientHeight,
            worldWidth: 1000,
            worldHeight: 1000,
            interaction: this._app.renderer.plugins.interaction,
        });

        this._app.stage.addChild(this._viewport);

        this._viewport
            .drag()
            .pinch()
            .wheel()
            .decelerate();
    }
}
