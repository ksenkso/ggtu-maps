/**
 * @typedef {{
            autoStart?: boolean,
            width?: number,
            height?: number,
            view?: HTMLCanvasElement,
            transparent?: boolean,
            autoDensity?: boolean,
            antialias?: boolean,
            preserveDrawingBuffer?: boolean,
            resolution?: number,
            forceCanvas?: boolean,
            backgroundColor?: number,
            clearBeforeRender?: boolean,
            forceFXAA?: boolean,
            powerPreference?: string,
            sharedTicker?: boolean,
            sharedLoader?: boolean,
            resizeTo?: Window | HTMLElement
        }} PIXIOptions
 * @typedef {{
 * root: HTMLElement,
 * startLocationId?: number,
 * app?: PIXIOptions,
 * api?: ApiClientOptions & {instance: ApiClient},
 * renderer: RendererOptions
 * }} MapOptions
 */
import * as PIXI from 'pixi.js';
import ApiClient from '../api/ApiClient';
import EventEmitter from './EventEmitter';
import Renderer from './Renderer';

export default class Map extends EventEmitter {
    /**
     *
     * @type {PIXIOptions}
     */
    static defaultOptions = {
        backgroundColor: 0xffffff
    };

    get isLoading() {
        return this._isLoadingStartLocation || this._renderer.mapLoader.loading;
    }

    /**
     *
     * @param {MapOptions} options
     */
    constructor(options = {}) {
        super();
        this.root = options.root;
        // 1. init a PIXI app, get ready to load a location,
        this.app = new PIXI.Application(Object.assign({}, Map.defaultOptions, options.app));
        this.root.appendChild(this.app.view);
        // 2. to do that, create an API instance or take it from options
        if (options.api.instance) {
            this.api = options.api.instance;
        } else {
            this.api = ApiClient.getInstance(options.api ? options.api : {});
        }
        // 3. initiate renderer
        options.renderer = Object.assign({}, options.renderer, {map: this});
        this._renderer = new Renderer(options.renderer);
        this.emit('map-ready');
        this.init(options).then(() => this.emit('map-loaded'), this.getLocation());
    }

    async init(options) {

        // now the map is ready to render things. fire `map-ready` event
        // 4. get root location or one specified in constructor options
        let location;
        this._isLoadingStartLocation = true;
        if (options.startLocationId) {
            location = await this.api.locations.get(options.startLocationId);
        } else {
            location = await this.api.locations.getRoot();
        }
        this._isLoadingStartLocation = false;
        // 5. render the location
        this.setLocation(location);
    }

    setLocation(location) {
        this._currentLocation = location;
        this.emit('location-change', location);
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
