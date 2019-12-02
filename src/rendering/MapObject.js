import {Container, Graphics} from "pixi.js";

export default class MapObject extends Container {
    constructor(object) {
        super();
        this.id = object.id;
        this.BuildingId = object.BuildingId;
        this.PlaceId = object.PlaceId;
        this.graphics = new Graphics();
    }

    /**
     * Map object calls this method to render an object.
     *
     *
     * @param {PIXI.Container} container
     */
    draw(container) {
        this.graphics.drawPolygon(this.coordinates);
        container.addChild(this);
    }
}
