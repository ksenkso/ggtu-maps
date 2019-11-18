/**
 * @class Place
 */
class Place {
    constructor({name, type, LocationId = null, id = null, coordinates = []}) {
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
