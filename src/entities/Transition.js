export default class Transition {
    constructor({name, type, id = null, BuildingId = null}) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.BuildingId = BuildingId;
    }
}
