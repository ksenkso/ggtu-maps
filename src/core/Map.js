import {assignOptions} from '../utils/common';
import * as PIXI from 'pixi.js';
import ApiClient from '../api/ApiClient';
import EventEmitter from './EventEmitter';
import Renderer from './Renderer';

export default class Map extends EventEmitter {
    get app() {
        return this._app;
    }

    get api() {
        return this._api;
    }

    constructor(options) {
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

    async init(options) {

        // now the map is ready to render things. fire `map-ready` event
        // 4. get root location or one specified in constructor options
        let location;
        if (options.startLocationId) {
            location = await this._api.locations.get(options.startLocationId);
        } else {
            location = await this._api.locations.getRoot();
        }
        // 5. render the location
        this.setLocation(location);
    }

    setLocation(location) {
        this._currentLocation = location;
        this._renderer.renderLocation(location)
            .then(() => this.emit('location-loaded'));
        // when the map is rendered, fire `map-loaded`
    }

    getLocation() {
        return this._currentLocation;
    }

    getCoords() {}

    getZoom() {}
}
