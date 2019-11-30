/**
 * @typedef {{
 * map: Map,
 * clamp?: ClampOptions,
 * drag?: DragOptions,
 * clampZoom?: ClampZoomOptions,
 * wheel?: WheelOptions,
 * pinch?: PinchOption
 * }} RendererOptions
 */
import ApiClient from '../api/ApiClient';
import EventEmitter from './EventEmitter';
import {Viewport} from 'pixi-viewport';
import {Loader, Sprite} from 'pixi.js';

const WORLD_SIZE = 512;

export default class Renderer extends EventEmitter {
    /**
     *
     * @param {RendererOptions} options
     */
    constructor(options) {
        super();
        this.app = options.map.app;
        this.init(options);
    }

    /**
     *
     * @param {RendererOptions} options
     */
    init(options) {
        this.tileSize = 256;
        this.location = null;
        this.mainLoadingQueue = new Set();
        this.secondaryLoadingQueue = new Set();
        this.mapLoader = new Loader();
        this.mapLoader.onLoad.add(this.onTileLoaded.bind(this));
        this.mapLoader.onComplete.add(this.onMainQueueLoaded.bind(this));
        this._viewport = new Viewport({
            screenWidth: this.app.view.width,
            screenHeight: this.app.view.height,
            worldWidth: WORLD_SIZE,
            worldHeight: WORLD_SIZE,
            interaction: this.app.renderer.plugins.interaction
        });
        this._viewport.sortableChildren = true;
        this._viewport.on('zoomed-end', this.onZoomEnd.bind(this));
        this.app.stage.addChild(this._viewport);
        this.sprites = [new Sprite(), new Sprite(), new Sprite(), new Sprite(), ...Array(16 + 64).fill(null)];
        this.placeSprites(0, 2);
        // set default values
        options.clamp = options.clamp !== undefined ? options.clamp : {
            direction: 'all'
        };
        options.clampZoom = options.clampZoom !== undefined ? options.clampZoom : {
            maxWidth: WORLD_SIZE ** 2 / this.app.view.width,
            maxHeight: WORLD_SIZE ** 2 / this.app.view.height
        };
        console.log(options);
        for (const feature of ['drag', 'pinch', 'wheel', 'clamp', 'clampZoom']) {
            console.log(feature);
            if (options[feature] !== undefined) {
                this._viewport[feature](options[feature])
            } else {
                this._viewport[feature]();
            }
        }
        // this._viewport
        //     .drag(options.drag)
        //     .pinch(options.pinch)
        //     .wheel(options.wheel)
        //     .clamp(options.clamp)
        //     .clampZoom(options.clampZoom);
        this.zoomLevel = this.getZoomLevel();
        this.fillSpritesForZoomLevel(this.zoomLevel);
        this.hideIrrelevantSprites(this.zoomLevel);
    }

    /**
     *
     * @param {number} startIndex
     * @param {number} matrixWidth
     */
    placeSprites(startIndex, matrixWidth) {
        const end = matrixWidth ** 2;
        for (let i = 0; i < end; i++) {
            this.sprites[i + startIndex].position.set((i % matrixWidth) * this.tileSize, (i / matrixWidth | 0) * this.tileSize);
        }
    }

    onZoomEnd() {
        const newZoomLevel = this.getZoomLevel();
        const diff = newZoomLevel - this.zoomLevel;
        this.zoomLevel = newZoomLevel;

        if (diff !== 0) {
            // zoom level has changed
            // load 16 sprites and render them
            this.fillSpritesForZoomLevel(newZoomLevel);
            this.renderLocation(this.location);
        }
    }

    /**
     *
     * @param {number} newZoomLevel
     */
    fillSpritesForZoomLevel(newZoomLevel) {
        const startIndex = this.getFirstSpriteIndex();
        if (!this.sprites[startIndex]) {
            this.tileSize = 256 / (2 ** (newZoomLevel - 1));
            const matrixWidth = this.getMatrixWidth();
            const matrixSize = matrixWidth ** 2;
            const scale = 1 / (2 ** (newZoomLevel - 1));
            const sprites = Array(matrixSize).fill(null).map(() => {
                const s = new Sprite();
                s.scale.set(scale, scale);
                s.alpha = 0;
                return s;
            });
            this.sprites.splice(startIndex, matrixSize, ...sprites);
            this.placeSprites(startIndex, matrixWidth);
        }
    }

    onMainQueueLoaded() {
        if (this.secondaryLoadingQueue.size) {
            this.secondaryLoadingQueue.forEach(name => {
                this.addToLoader(name);
                this.secondaryLoadingQueue.delete(name);
            })
        } else {
            this.hideIrrelevantSprites(this.zoomLevel);
        }
    }

    addToLoader(name) {
        if (!(name in this.mapLoader.resources)) {
            this.mapLoader.add(
                name,
                `${ApiClient.mapsBase}/${name}.jpeg`
            );
            this.mainLoadingQueue.add(name);
        } else {
            if (!this.mapLoader.resources[name].isComplete) {
                this.mapLoader.resources[name].abort();
                this.mapLoader.add(
                    name,
                    `${ApiClient.mapsBase}/${name}.jpeg`
                );
                this.mainLoadingQueue.add(name);
            } else {
                this.onTileLoaded(this.mapLoader, this.mapLoader.resources[name])
            }
        }
    }

    /**
     * Called when a tile has been loaded
     *
     * @param {PIXI.Loader} loader
     * @param {PIXI.LoaderResource} resource
     */
    onTileLoaded(loader, resource) {
        if (this.mainLoadingQueue.has(resource.name)) {
            this.mainLoadingQueue.delete(resource.name);
        }
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
        const index = this.getFirstSpriteIndex() + y * this.getMatrixWidth() + x;
        const sprite = this.sprites[index];
        sprite.texture = tile.texture;
        sprite.alpha = 1;
        if (!sprite.parent) {
            this._viewport.addChild(sprite)
        }
        if (this.mainLoadingQueue.size === 0 && this.secondaryLoadingQueue.size === 0) {
            this.emit('location-rendered', this.location);
        }
    }

    renderLocation(location) {
        this.location = location;
        const markup = this.getWorldMarkup();
        this.loadMap(location.id, markup, this.getZoomLevel());
    }

    /**
     * This returns an array of objects, representing tiles visibility in the viewport
     * @return {{row: number, col: number, viewport: boolean}[]}
     */
    getWorldMarkup() {
        const gStart = {
            x: Math.ceil(this._viewport.corner.x / this.tileSize),
            y: Math.ceil(this._viewport.corner.y / this.tileSize),
        };
        const gEnd = {
            x: Math.floor((this._viewport.corner.x + this._viewport.screenWidth) / this.tileSize),
            y: Math.floor((this._viewport.corner.y + this._viewport.screenHeight) / this.tileSize),
        };
        const matrixWidth = this.getMatrixWidth();
        const grid = [];
        for (let i = 0; i < matrixWidth; i++) {
            for (let j = 0; j < matrixWidth; j++) {
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
            const aCenter = this.getTileCenter(a);
            const bCenter = this.getTileCenter(b);
            const aDist = Math.hypot(aCenter.x - viewportCenter.x, aCenter.y = viewportCenter.y);
            const bDist = Math.hypot(bCenter.x - viewportCenter.x, bCenter.y = viewportCenter.y);
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
                console.log(name);
                this.addToLoader(name);
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
        return Math.min(Math.round(this._viewport.scale.x) || 1, 3);
    }

    /**
     * @param {number} [zoomLevel]
     * @return {number}
     */
    getMatrixWidth(zoomLevel) {
        return 2 ** (zoomLevel || this.zoomLevel);
    }

    /**
     *
     * @param {{col: number, row: number, viewport: boolean}} tile
     * @return {{x: number}}
     */
    getTileCenter(tile) {
        return {
            x: (tile.col - 0.5) * this.tileSize,
            y: (tile.row - 0.5) * this.tileSize
        };
    }

    getFirstSpriteIndex(zoomLevel) {
        const zoom = zoomLevel || this.zoomLevel;
        return zoom === 1 ? 0 : zoom === 2 ? 4 : 20;
    }

    /**
     *
     * @param {number} newZoomLevel
     */
    hideIrrelevantSprites(newZoomLevel) {
        const matrixWidth = this.getMatrixWidth(newZoomLevel);
        const startIndex = this.getFirstSpriteIndex(newZoomLevel);
        const end = matrixWidth ** 2;
        for (let i = 0; i < startIndex; i++) {
            if (this.sprites[i]) {
                this.sprites[i].alpha = 0;
            }
        }
        for (let i = startIndex + end; i < this.sprites.length; i++) {
            if (this.sprites[i]) {
                this.sprites[i].alpha = 0;
            }
        }
    }
}
