export default class TransitionView {
    constructor({LocationId, id = null, TransitionId = null, coordinates = []}) {
        this.LocationId = LocationId;
        this.id = id;
        this.TransitionId = TransitionId;
        this.coordinates = coordinates;
    }
}
