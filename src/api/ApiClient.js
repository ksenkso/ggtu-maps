import axios from 'axios';
import * as qs from 'qs';
import BuildingsEndpoint from '../api/endpoints/BuildingsEndpoint';
import LocationsEndpoint from '../api/endpoints/LocationsEndpoint';
import PlacesEndpoint from '../api/endpoints/PlacesEndpoint';
import SearchEndpoint from '../api/endpoints/SearchEndpoint';
import TransitionsEndpoint from '../api/endpoints/TransitionsEndpoint';
import UserInfo from '../core/UserInfo';

export default class ApiClient {

    set token(token) {
        this.api.defaults.headers.Authorization = token ? `Bearer ${token}` : '';
    }

    get token() {
        return this.userInfo.user.token;
    }

    static base = 'http://192.168.1.68:3000';

    static get apiBase() {
        return ApiClient.base + '/v1';
    }

    static get mapsBase() {
        return ApiClient.base + '/maps';
    }

    static getInstance(params) {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient(params);
        }
        return ApiClient.instance;
    }

    constructor(params = {}) {
        if (params.base) {
            ApiClient.base = params.base;
        }
        /**
         *
         * @type {AxiosInstance}
         */
        this.api = axios.create({
            baseURL: ApiClient.apiBase,
        });
        this.api.defaults.paramsSerializer = (params) => qs.stringify(params, {encodeValuesOnly: true});
        this.userInfo = new UserInfo(this);
        if (params.user) {
            this.userInfo.user = params.user;
        }
        /**
         *
         * @type {BuildingsEndpoint}
         */
        this.buildings = new BuildingsEndpoint(this.api);
        /**
         *
         * @type {LocationsEndpoint}
         */
        this.locations = new LocationsEndpoint(this.api);
        /**
         *
         * @type {PlacesEndpoint}
         */
        this.places = new PlacesEndpoint(this.api);
        /**
         *
         * @type {TransitionsEndpoint}
         */
        this.transitions = new TransitionsEndpoint(this.api);
        /**
         *
         * @type {SearchEndpoint}
         */
        this.search = new SearchEndpoint(this.api);
    }

    /**
     *
     * @return {AxiosInstance}
     */
    getTransport() {
        return this.api;
    }

    /**
     *
     * @throws Error
     */
    async authenticate(login, password) {
        const response = await this.api.post('login', {login, password});
        if (response) {
            this.api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
            this.token = response.data.token;
            this.userInfo.user = response.data;
            return response.data;
        } else {
            return null;
        }
    }

    /**
     *
     * @throws Error
     */
    async checkToken(token) {
        const response = await this.api.get('auth', {params: {token}});
        if (response && response.data.ok) {
            this.token = token;
            const user = this.userInfo.user;
            user.token = token;
            this.userInfo.user = user;
            return true;
        }
    }

    getEndpointByType(type) {
        switch (type) {
            case 'place':
                return this.places;
            case 'building':
                return this.buildings;
            case 'transition':
                return this.transitions;
            case 'transition-view':
                return this.transitions.views;
        }
        return null;
    }
}
