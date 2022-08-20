import useAuth from '../composables/useAuth'
import useApi from '../composables/useApi'
import type { RequestOptions, ApiOptions } from '../../types';

class RequestClass {
    opts: ApiOptions;
    error: any;

    /**
     * @param {[key: string]: any} options
     */
    constructor (options: ApiOptions) {
        this.opts = options
        this.error = console.error
    }

    /**
     * @param {string} endpoint
     * @param {RequestOptions} opts
     * @returns Promise
     */
    get (endpoint: string, opts?: RequestOptions) {
        opts = opts ?? {};
        opts.method = 'GET';
        return this.send(endpoint, opts);
    }

    /**
     * @param {string} endpoint
     * @param {RequestOptions} opts
     * @returns Promise
     */
    post (endpoint: string, opts?: RequestOptions) {
        opts = opts ?? {};
        opts.method = 'POST';
        return this.send(endpoint, opts);
    }

    /**
     * @param {string} endpoint
     * @param {RequestOptions} opts
     * @returns Promise
     */
    send (endpoint: string, opts?: RequestOptions) {
        const { getToken } = useAuth()
        const token: string = getToken()?.access_token;

        opts = opts ?? {};
        opts.headers = opts.headers ?? {};

        if(token) {
            opts.headers['Authorization'] = `Bearer ${token}`;
        }

        let pickStatusDisable = {
            status_code: false,
            status_message: false,
        }
        if(opts.pick?.length > 0) {
            if(!opts.pick.includes('status_code')) {
                opts.pick.push('status_code')
                pickStatusDisable.status_code = true
            }
            if(!opts.pick.includes('status_message')) {
                opts.pick.push('status_message')
                pickStatusDisable.status_message = true
            }
        }

        const url = this.generateUrl(!!opts.route ? opts.route.url : this.opts.url, endpoint);

        const fetchData = function(resolve: Function, reject: Function) {
            useApi(url, opts).then(async ({ pending, error, data, refresh }) => {
                // if (process.client && error.value) {
                //     await refresh()
                // }

                // @ts-ignore
                if(!error.value && typeof data.value === 'object' && data.value?.status_code === 'OK') {
                    // @ts-ignore
                    if(pickStatusDisable.status_code && data.value.status_code) {
                        // @ts-ignore
                        delete data.value.status_code;
                    }
                    // @ts-ignore
                    if(pickStatusDisable.status_message && data.value.status_message) {
                        // @ts-ignore
                        delete data.value.status_message;
                    }
                    resolve(data.value);
                } else if(error.value) {
                    // @ts-ignore
                    reject(error.value?.response?._data);
                } else {
                    reject(data.value);
                }
            }).catch((err) => {
                reject(err);
            })
        }

        return new Promise(fetchData);
    }

    generateUrl(path: string, endpoint: string) {
        return path.replace(/\/*$/gm, '') + '/' + endpoint;
    }
}

const request = (options: ApiOptions) => {
    const req = new RequestClass(options);
    const routes = options?.routes;

    if(routes && routes.length > 0) {
        for(const route of routes) {
            if(!route.name.length || !route.url.length) {
                continue;
            }

            for (const method of ['get', 'post']) {
                Object.defineProperty(req, method + route.name.ucfirst(), {
                    get: () => (endpoint: string, opts?: RequestOptions) => {
                        opts = opts ?? {};
                        opts.route = route;
                        return req[method](endpoint, opts)
                    }
                });
            }
        }
    }

    return req;
}

export default request;