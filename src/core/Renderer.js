import ApiClient from '../api/ApiClient';
import EventEmitter from './EventEmitter';
import {Viewport} from 'pixi-viewport';

export default class Renderer extends EventEmitter {
    
    _api = ApiClient.getInstance();

    static cellSize = 512;

    constructor(_map) {
        super();
        this._app = _map.app;
        this.init();
    }

    init() {
        this.loadingQueue = new Set();
        this.mapLoader = new PIXI.Loader();
        this.mapLoader.onLoad.add(this.onTileLoaded.bind(this));
        this._viewport = new Viewport({
            screenWidth: this._map.root.clientWidth,
            screenHeight: this._map.root.clientHeight,
            worldWidth: 1000,
            worldHeight: 1000,
            interaction: this._app.renderer.plugins.interaction
        });

        this._app.stage.addChild(this._viewport);

        this._viewport
            .drag()
            .pinch()
            .wheel()
            .decelerate();
    }

    /**
     *
     * @param {PIXI.Loader} loader
     * @param {PIXI.LoaderResource} resource
     */
    onTileLoaded(loader, resource) {
        this.loadingQueue.delete(resource.name);
    }

    /**
     *
     * @param {PIXI.LoaderResource} tile
     */
    renderTile(tile) {

    }

    async renderLocation(location) {
        const params = {
            locationId: location.id,
            zoom: this._viewport.scale.x,
            x: this._viewport.center.x,
            y: this._viewport.center.y,
            width: 0,
            height: 0
        };
        this.loadMap(params);
    }

    getGridSize() {
        return {
            rows: this._viewport.worldWidth / Renderer.cellSize,
            cols: this._viewport.worldHeight / Renderer.cellSize
        }
    }

    getWorldSubgrid() {
        const gStart = {
            x: Math.ceil(this.dx / Renderer.cellSize),
            y: Math.ceil(this.dy / Renderer.cellSize),
        };
        const gEnd = {
            x: Math.floor((this._viewport.corner.x + this._viewport.screenWidth) / Renderer.cellSize),
            y: Math.floor((this._viewport.corner.y + this._viewport.screenHeight) / Renderer.cellSize),
        };
        const sizes = this.getGridSize();
        const grid = [];
        for (let i = gStart.y; i <= gEnd.y; i++) {
            const r = [];
            for(let j = gStart.x; j <= gEnd.x; j++) {
                r.push(i * sizes.cols + j);
            }
            grid.push(r);
        }
        return grid;
    }

    /**
     *
     * @param {{locationId: number, width: number, height: number, x: number, y: number, zoom: number}} params
     */
    loadMap(params) {
        for (let i = params.x; i < params.width; i++) {
            for (let j = params.j; j < params.height; j++) {
                const name = `${params.locationId}/${params.zoom}/${j}_${i}`;
                this.mapLoader.add(
                    name,
                    `${ApiClient.mapsBase}/${name}.jpeg`
                );
                this.loadingQueue.add(name);
            }
        }
    }
}
