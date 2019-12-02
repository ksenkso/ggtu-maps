import {Container} from "pixi.js";

/**
 * @class MapObject
 * @property {number[]} coordinates
 */
export default class MapObject extends Container {

    static style = {};

    constructor(object) {
        super();
        this.id = object.id;
        this.BuildingId = object.BuildingId;
        this.PlaceId = object.PlaceId;
        this.graphics = null;
    }
}
