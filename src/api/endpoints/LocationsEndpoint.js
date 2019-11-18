import BaseEndpoint from '../common';

export default class LocationsEndpoint extends BaseEndpoint {
    route = 'locations/';

    constructor(api) {
        super(api);
    }

    async getPlaces(locationId, params) {
        const response = await this.api.get(this.route + locationId + '/places', {params});
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    async getRoot() {
        const response = await this.api.get(this.route + 'root');
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    async getObjects(locationId) {
        const response = await this.api.get(this.route + locationId + '/objects');
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    async getPathGraph(locationId) {
        const response = await this.api.get(this.route + locationId + '/paths');
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

}
