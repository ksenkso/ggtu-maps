import BaseEndpoint from '../common';

export default class LocationsEndpoint extends BaseEndpoint {
    route = 'locations/';

    /**
     *
     * @param {ApiClient} api
     */
    constructor(api) {
        super(api);
    }

    /**
     *
     * @param {number} locationId
     * @param {object} params
     * @return {Promise<null|Place[]>}
     */
    async getPlaces(locationId, params) {
        const response = await this.api.get(this.route + locationId + '/places', {params});
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    /**
     *
     * @return {Promise<null|Location>}
     */
    async getRoot() {
        const response = await this.api.get(this.route + 'root');
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    /**
     *
     * @param locationId
     * @return {Promise<null|MapObject>}
     */
    async getObjects(locationId) {
        const response = await this.api.get(this.route + locationId + '/objects');
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    /**
     *
     * @param {number} locationId
     * @return {Promise<null|*>}
     */
    async getPathGraph(locationId) {
        const response = await this.api.get(this.route + locationId + '/paths');
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

}
