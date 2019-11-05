import ApiClient from '../api/ApiClient';
import EventEmitter from './EventEmitter';
import {Viewport} from 'pixi-viewport';
import {Loader, Sprite} from 'pixi.js';

/**
 *
 * @param {{col: number, row: number, viewport: boolean}} tile
 * @return {{x: number}}
 */
function getTileCenter(tile) {
    return {
        x: (tile.col - 0.5) * Renderer.tileSize,
        y: (tile.row - 0.5) * Renderer.tileSize
    };
}

export default class Renderer extends EventEmitter {

    static tileSize = 512;

    constructor(map) {
        super();
        this.app = map.app;
        this.init();
    }

    init() {
        this.location = null;
        this.mainLoadingQueue = new Set();
        this.secondaryLoadingQueue = new Set();
        this.mapLoader = new Loader();
        this.mapLoader.onLoad.add(this.onTileLoaded.bind(this));
        this.mapLoader.onComplete.add(this.onMainQueueLoaded.bind(this));
        this._viewport = new Viewport({
            screenWidth: this.app.view.width,
            screenHeight: this.app.view.height,
            worldWidth: 1024,
            worldHeight: 1024,
            interaction: this.app.renderer.plugins.interaction
        });
        this._viewport.on('zoomed-end', this.onZoomEnd.bind(this));
        this.app.stage.addChild(this._viewport);
        this.sprites = [new Sprite(), new Sprite(), new Sprite(), new Sprite()];
        this.sprites.forEach((s, n) => {
            s.position.set((n % 2) * Renderer.tileSize, (n / 2 | 0) * Renderer.tileSize);
            this._viewport.addChild(s);
        });

        this._viewport
            .drag()
            .pinch()
            .wheel()
            .decelerate()
            .clamp({direction: 'all'})
            .clampZoom({
                maxWidth: this.app.view.width,
                maxHeight: this.app.view.height
            });
        this.zoomLevel = this.getZoomLevel();
    }

    onZoomEnd() {
        const newZoomLevel = this.getZoomLevel();
        const diff = newZoomLevel - this.zoomLevel;
        this.zoomLevel = newZoomLevel;
        if (diff === 1) {
            // zoom level has changed, now its 2
            // load 16 sprites and render them
            const sprites = Array(16).fill(null).map(() => new PIXI.Sprite());
            sprites.forEach(s => this._viewport.addChild(s));
            // elevate current sprites
            this.sprites.forEach(/**@type {PIXI.Sprite}*/sprite => {
                sprite.zIndex = -1;
            });
            this.sprites.splice(0, 0, ...sprites);
            this.renderLocation(this.location);
        } else if (diff === -1) {
            // zoom level has changed, now its 1
            // load 4 sprites

        }
        // update zoom level
    }

    onMainQueueLoaded() {

        if (this.secondaryLoadingQueue.size) {
            this.secondaryLoadingQueue.forEach(name => {
                this.mapLoader.add(
                    name,
                    `${ApiClient.mapsBase}/${name}.jpeg`
                );
            })
        }
    }

    /**
     * Called when a tile has been loaded
     *
     * @param {PIXI.Loader} loader
     * @param {PIXI.LoaderResource} resource
     */
    onTileLoaded(loader, resource) {
        this.mainLoadingQueue.delete(resource.name);
        // render the tile
        const match = resource.name.match(/\d\/\d\/(\d)_(\d)/);
        const x = +match[1];
        const y = +match[2];
        this.renderTile(resource, x, y);
    }

    /**
     *
     * @param {PIXI.LoaderResource} tile
     * @param {number} x
     * @param {number} y
     */
    renderTile(tile, x, y) {
        const index = y * this.getMatrixWidth() + x;
        this.sprites[index].texture = tile.texture;
        if (this.mainLoadingQueue.size === 0 && this.secondaryLoadingQueue.size === 0) {
            this.emit('location-rendered', this.location);
        }
    }

    renderLocation(location) {
        const markup = this.getWorldMarkup();
        this.loadMap(location.id, markup, this.getZoomLevel());
    }

    getGridSize() {
        return {
            rows: this._viewport.worldWidth / Renderer.tileSize,
            cols: this._viewport.worldHeight / Renderer.tileSize
        }
    }

    /**
     * This returns an array of objects, representing tiles visibility in the viewport
     * @return {{row: number, col: number, viewport: boolean}[]}
     */
    getWorldMarkup() {
        const gStart = {
            x: Math.ceil(this._viewport.corner.x / Renderer.tileSize),
            y: Math.ceil(this._viewport.corner.y / Renderer.tileSize),
        };
        const gEnd = {
            x: Math.floor((this._viewport.corner.x + this._viewport.screenWidth) / Renderer.tileSize),
            y: Math.floor((this._viewport.corner.y + this._viewport.screenHeight) / Renderer.tileSize),
        };
        const wGridSize = this.getGridSize();
        const grid = [];
        for (let i = 0; i < wGridSize.rows; i++) {
            for (let j = 0; j < wGridSize.cols; j++) {
                grid.push({
                    row: i,
                    col: j,
                    viewport: i >= gStart.x && i <= gEnd.x && j >= gStart.y && j <= gEnd.y
                });
            }
        }
        // sort the grid by distance to the center of the viewport
        const viewportCenter = this._viewport.center;
        return grid.sort((a, b) => {
            const aCenter = getTileCenter(a);
            const bCenter = getTileCenter(b);
            const aDist = Math.hypot(aCenter.x - viewportCenter.x, aCenter.y =  viewportCenter.y);
            const bDist = Math.hypot(bCenter.x - viewportCenter.x, bCenter.y =  viewportCenter.y);
            return aDist - bDist;
        });
    }

    /**
     *
     * @param {number} locationId
     * @param {{col: number, row: number, viewport: boolean}[]} markup
     * @param {number} zoom current zoom level
     */
    loadMap(locationId, markup, zoom) {
        markup.forEach(tile => {
            const name = `${locationId}/${zoom}/${tile.col}_${tile.row}`;
            if (tile.viewport) {
                this.mapLoader.add(
                    name,
                    `${ApiClient.mapsBase}/${name}.jpeg`
                );
                this.mainLoadingQueue.add(name);
            } else {
                this.secondaryLoadingQueue.add(name);
            }
        });
        this.mapLoader.load();
    }

    /**
     *
     * @return {number}
     */
    getZoomLevel() {
        return this._viewport.scale.x >= 2 ? 2 : 1;
    }

    getMatrixWidth() {
        return this.zoomLevel === 2 ? 4 : 2;
    }
}
