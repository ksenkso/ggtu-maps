export default class Location {
    constructor({name, BuildingId = null, id = null}) {
        this.name = name;
        this.BuildingId = BuildingId;
        this.id = id;
    }
}
