export default class MapObject {
    constructor({id = null, PlaceId = null, BuildingId = null}) {
        this.id = id;
        this.PlaceId = PlaceId;
        this.BuildingId = BuildingId;
    }

    /**
     * @return {string | null}
     */
    getType() {
        return this.BuildingId || this.PlaceId ? this.BuildingId ? 'building' : 'place' : null;
    }
}
