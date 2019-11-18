export default class BaseEndpoint {
    /**
     *
     * @param {AxiosInstance} api
     */
    constructor(api) {
        this.api = api;
        this.route = '';
    }

    async create(model) {
        const response = await this.api.post(this.route, model);
        if (response.status === 201) {
            return response.data;
        } else {
            return null;
        }
    }

    async delete(id) {
        const response = await this.api.delete(this.route + id);
        return response.status === 200;
    }

    async get(id, params) {
        const response = await this.api.get(this.route + id, {params});
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    async getAll(params) {
        const response = await this.api.get(this.route, {params});
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    async update(id, fields) {
        const response = await this.api.patch(this.route + id, fields);
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }
}
