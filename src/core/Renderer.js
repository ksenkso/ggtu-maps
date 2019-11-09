import ApiClient from '../api/ApiClient';
import EventEmitter from './EventEmitter';
import {Viewport} from 'pixi-viewport';
import {Loader, Sprite} from 'pixi.js';

export default class Renderer extends EventEmitter {

    constructor(map) {
        super();
        this.app = map.app;
        this.init();
    }

    init() {
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
            worldWidth: 512,
            worldHeight: 512,
            interaction: this.app.renderer.plugins.interaction
        });
        this._viewport.sortableChildren = true;
        this._viewport.on('zoomed-end', this.onZoomEnd.bind(this));
        this.app.stage.addChild(this._viewport);
        this.sprites = [new Sprite(), new Sprite(), new Sprite(), new Sprite()];
        this.placeSprites();

        this._viewport
            .drag()
            .pinch()
            .wheel()
            .clamp({direction: 'all'})
            .clampZoom({
                maxWidth: this.app.view.width,
                maxHeight: this.app.view.height
            });
        this.zoomLevel = this.getZoomLevel();
    }

    placeSprites() {
        const matrixWidth = this.getMatrixWidth();
        for (let i = 0; i < matrixWidth**2; i++) {
            this.sprites[i].position.set((i % matrixWidth) * this.tileSize, (i / matrixWidth | 0) * this.tileSize);
        }
    }

    onZoomEnd() {
        const newZoomLevel = this.getZoomLevel();
        const diff = newZoomLevel - this.zoomLevel;
        this.zoomLevel = newZoomLevel;
        this.tileSize = 256 / newZoomLevel;
        if (diff === 1) {
            // zoom level has changed, now its 2
            // load 16 sprites and render them
            const sprites = Array(16).fill(null).map(() => {
                const s = new Sprite();
                s.scale.set(0.5, 0.5);
                s.alpha = 0;
                return s;
            });
            this.sprites.splice(0, 0, ...sprites);
            this.placeSprites(sprites);
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
                this.addToLoader(name);
                this.secondaryLoadingQueue.delete(name);
            })
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
        return this._viewport.scale.x >= 2 ? 2 : 1;
    }

    /**
     *
     * @return {number}
     */
    getMatrixWidth() {
        return this.zoomLevel === 2 ? 4 : 2;
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
}
