export default class Building {
    constructor({name, type, id = null, coordinates = []}) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.coordinates = coordinates;
    }
}
