import MapObject from "../rendering/MapObject";
/**
 * @class Place
 */
class Place extends MapObject {
    constructor({name, type, LocationId = null, id = null, coordinates = [], MapObject = {}}) {
        super(MapObject);
        this.name = name;
        this.type = type;
        this.LocationId = LocationId;
        this.id = id;
        this.coordinates = coordinates;
    }
}

Place.GYM = 'gym';
Place.CABINET = 'cabinet';
Place.WC = 'wc';
Place.OTHER = 'other';

export default Place;
