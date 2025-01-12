import { dto } from '../http/dto.js';
import { storage } from './storage.js';
import { request, HTTP_POST } from '../http/request.js';

export const session = (() => {

    /**
     * @type {ReturnType<typeof storage>|null}
     */
    let ses = null;

    /**
     * @returns {string|null}
     */
    const getToken = () => ses.get('token');

    /**
     * @param {object} body
     * @returns {Promise<boolean>}
     */
    const login = (body) => {
        return request(HTTP_POST, '/api/session')
            .body(body)
            .send(dto.tokenResponse)
            .then(
                (res) => {
                    if (res.code === 200) {
                        setToken(res.data.token);
                    }

                    return res.code === 200;
                },
                () => false
            );
    };

    /**
     * @returns {void}
     */
    const logout = () => ses.unset('token');

    /**
     * @param {string} token
     * @returns {void}
     */
    const setToken = (token) => ses.set('token', token);

    /**
     * @returns {boolean}
     */
    const isAdmin = () => String(getToken() ?? '.').split('.').length === 3;

    /**
     * @returns {Promise<ReturnType<typeof dto.baseResponse<object>>}
     */
    const guest = () => {
        let res = {
            "code": 200,
            "data": {
                "name": "AncLab",
                "can_edit": true,
                "can_delete": true,
                "can_reply": true
            },
            "error": null
        };
        const config = storage('config');
                for (let [k, v] of Object.entries(res.data)) {
                    config.set(k, v);
                }

                return res;
    };

    /**
     * @returns {object|null}
     */
    const decode = () => {
        if (!isAdmin()) {
            return null;
        }

        try {
            return JSON.parse(window.atob(getToken().split('.')[1]));
        } catch {
            return null;
        }
    };

    /**
     * @returns {void}
     */
    const init = () => {
        ses = storage('session');
    };

    return {
        init,
        guest,
        login,
        logout,
        decode,
        isAdmin,
        setToken,
        getToken,
    };
})();