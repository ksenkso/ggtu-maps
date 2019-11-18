import axios from 'axios';
import * as qs from 'qs';
import BuildingsEndpoint from '../api/endpoints/BuildingsEndpoint';
import LocationsEndpoint from '../api/endpoints/LocationsEndpoint';
import PlacesEndpoint from '../api/endpoints/PlacesEndpoint';
import SearchEndpoint from '../api/endpoints/SearchEndpoint';
import TransitionsEndpoint from '../api/endpoints/TransitionsEndpoint';
import UserInfo from '../core/UserInfo';

export default class ApiClient {
    /**
     *
     * @param {string} token
     */
    set token(token) {
        this.api.defaults.headers.Authorization = token ? `Bearer ${token}` : '';
    }

    /**
     *
     * @return {*|CancelToken}
     */
    get token() {
        return this.userInfo.user.token;
    }

    static base = 'http://192.168.1.68:3000';

    /**
     *
     * @return {string}
     */
    static get apiBase() {
        return ApiClient.base + '/v1';
    }

    /**
     *
     * @return {string}
     */
    static get mapsBase() {
        return ApiClient.base + '/maps';
    }

    /**
     *
     * @param params
     * @return {ApiClient}
     */
    static getInstance(params) {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient(params);
        }
        return ApiClient.instance;
    }

    /**
     *
     * @param {{base: string, user?: User}} params
     */
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
     * @param {string} type
     * @return {TransitionViewsEndpoint|TransitionsEndpoint|null|PlacesEndpoint|BuildingsEndpoint}
     */
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
