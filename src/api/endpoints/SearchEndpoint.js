import ApiClient from '../ApiClient';

export default class SearchEndpoint {
    route = '/search';
    constructor(api) {
        this.api = api;
    }

    async query(input) {
        const response = await this.api.get(
            ApiClient.apiBase + this.route,
            {params: {q: input}},
        );
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    async findPath(from, to) {
        const response = await this.api.get(
            ApiClient.apiBase + this.route + '/path',
            {params: {from, to}},
        );
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }
}
