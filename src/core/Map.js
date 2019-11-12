import {assignOptions} from '../utils/common';
import * as PIXI from 'pixi.js';
import ApiClient from '../api/ApiClient';
import EventEmitter from './EventEmitter';
import Renderer from './Renderer';

export default class Map extends EventEmitter {

    /**
     *
     * @param {object} options
     */
    constructor(options = {}) {
        super();
        assignOptions(this, options);
        // 1. init a PIXI app, get ready to load a location,
        this.app = new PIXI.Application(options.app || {});
        this.root.appendChild(this.app.view);
        // 2. to do that, create an API instance.
        this.api = ApiClient.getInstance(options.api ? options.api : {});
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
            location = await this.api.locations.get(options.startLocationId);
        } else {
            location = await this.api.locations.getRoot();
        }
        // 5. render the location
        this.setLocation(location);
    }

    setLocation(location) {
        this._currentLocation = location;
        this._renderer.renderLocation(location)
    }

    /**
     *
     * @param {number} locationId
     */
    setLocationById(locationId) {
        this.api.locations.get(locationId)
            .then(location => this.setLocation(location));
    }

    getLocation() {
        return this._currentLocation;
    }

    getCoords() {}

    getZoom() {}
}
