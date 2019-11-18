/**
 * @typedef {{user_id: number, iat: number, exp: number, text: string}} TokenInfo
 */
export default class AuthEndpoint {
    /**
     *
     * @param {AxiosInstance} api
     */
    constructor(api) {
        this.api = api;
    }

    /**
     *
     * @throws Error
     * @return {Promise<User|null>}
     */
    async authenticate(login, password) {
        const response = await this.api.post('login', {login, password});
        if (response) {
            this.api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
            return /**@type {User} */response.data;
        } else {
            return null;
        }
    }

    /**
     *
     * @throws Error
     * @return {Promise<boolean>}
     */
    async checkToken(token) {
        const response = await this.api.get('auth', {params: {token}});
        return !!(response && response.data.ok);

    }

    /**
     * Gets token info. Token is sent in Authorization header.
     *
     * @return {Promise<TokenInfo|null>}
     */
    async getTokenInfo() {
        const response = await this.api.get('/users/tokenInfo');
        if (response.status === 200) {
            return /**@type TokenInfo */response.data;
        } else {
            return null;
        }
    }
}
