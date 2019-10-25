import _ from 'lodash';
// Store
import store from '_core/store';
// Utils
import env from '_core/utils/env.utils';
import CACHE from '_core/utils/cache.utils';
import log from '_core/utils/log.utils';
import routerUrls from '_core/utils/routerUrls.utils';
import { deleteEmptyPathSections } from '_core/utils/string.utils';
// Components
import CustomError from '_core/components/elements/CustomError';

const API = {
    CLIENT_URL_PREFIX: '/api/v1/',

    ADMIN_URL_PREFIX: '/api/v1/admin/',

    refreshTokenPromise: null,

    get urlPrefix() {
        return env.PROJECT_NAME === 'admin'
            ? API.ADMIN_URL_PREFIX
            : API.CLIENT_URL_PREFIX;
    },

    get isOffline() {
        let isOffline = false;
        if (
            typeof window !== 'undefined' &&
            'navigator' in window &&
            window.navigator.onLine === false
        ) {
            isOffline = true;
        }
        return isOffline;
    },

    url: ({ urlPrefix = API.urlPrefix } = {}) => {
        if (env.MODE === 'container') {
            return `${env.CONTAINER_HOST_ADDR}${urlPrefix}`;
        }

        return `${env.API_URL}${urlPrefix}`;
    },

    createURL: (url, params) => {
        const cleanUrl = deleteEmptyPathSections(url);

        if (!params) return cleanUrl;

        const paramsString = new URLSearchParams(
            _.pickBy(params, _.negate(_.isNil))
        ).toString();
        if (!paramsString) return cleanUrl;

        return `${cleanUrl}?${paramsString}`;
    },

    formatBody: (data) => {
        if (!data.options) return data;
        const formattedBody = JSON.stringify(data.options.body);

        const opts = {
            ...data.options,
            ...(formattedBody && { body: formattedBody }),
        };

        return { ...data, options: opts };
    },

    checkStatus: (response) => {
        if (response.ok) {
            return response;
        }

        throw new CustomError(response);
    },

    parseResponse: async (response, type, options) => {
        const parsedData = await response[type]();
        if (options.withHeadersInResponse && type !== 'text') {
            parsedData.headers = response.headers;
        }
        return parsedData;
    },

    handleResponse: (response, options) => {
        if (!response) return;

        const type = response.headers.get('content-type') || '';

        if (type.includes('text'))
            return API.parseResponse(response, 'text', options);
        if (type.includes('image'))
            return API.parseResponse(response, 'blob', options);
        if (type.includes('json'))
            return API.parseResponse(response, 'json', options);
        return response;
    },

    parseError: async (error, options) => {
        // TODO: StRef. BackEnd must handle this case. Can't send text for us
        // https://fs1-dev.fex.net:9090/upload/2000008759
        let parsedError = await API.handleResponse(error.response, options);
        if (typeof parsedError === 'string') {
            throw {
                error: {
                    code: error.response.status,
                    msg: parsedError,
                },
            };
        } else {
            throw {
                error: parsedError || error,
            };
        }
    },

    refreshTokenAndRefetch: async ({
        url,
        params,
        method,
        headers,
        options,
        parsedError,
    }) => {
        // We have not resolved [refreshTokenPromise] yet, so waiting for [refreshToken]
        if (!API.refreshTokenPromise) {
            if (store.userToken.authClientToken) {
                const refreshToken = store.userToken.authClientRefreshToken;
                API.refreshTokenPromise = store.userToken.refreshToken({
                    token: refreshToken,
                });
            } else {
                API.refreshTokenPromise = store.fs.shared.refreshAnonToken();
            }
        }

        await API.refreshTokenPromise;

        // Clear promise after [refresh token]
        API.refreshTokenPromise = null;

        if (store.userToken.authClientToken) {
            return await API.request({ url, params, method, headers, options }); // Repeat request with [refreshed token]
        }

        return parsedError;
    },

    tokenErrorHandler: async ({
        parsedError,
        url,
        params,
        method,
        headersOpts,
        options,
    }) => {
        const headers = API.getHeaders(headersOpts);
        // Invalid (expired) token on AnonPage
        const isInvalidToken =
            parsedError.error.code === 2001 || parsedError.error.code === 2002;

        if (isInvalidToken && store.is.AnonPage) {
            log.l('API-INVALID-TOKEN-ERROR');
            if (store.fs.shared.hasLink) {
                store.goToPage({
                    url: `${routerUrls.goTo.SharedPage}/${
                        store.fs.shared.link
                    }`,
                });
                store.modals.open({ id: 'ExpiredAnonTokenModal' });
                return parsedError;
            } else {
                return await API.refreshTokenAndRefetch({
                    url,
                    params,
                    method,
                    headers,
                    options,
                });
            }
        }

        const isRefreshTokenInvalid =
            parsedError.error.form &&
            parsedError.error.form.token &&
            parsedError.error.form.token[0] === 2002;

        const isRefreshTokenExpired =
            parsedError.error.code === 2003 && API.refreshTokenPromise;

        if (isInvalidToken || isRefreshTokenExpired || isRefreshTokenInvalid) {
            log.l(
                `API-INVALID${
                    isRefreshTokenExpired || isRefreshTokenInvalid
                        ? '-REFRESH'
                        : ''
                }-TOKEN-ERROR`,
                'removeCurrToken+getConfig'
            );
            store.userToken.remove();
            // Call request without [token]
            store.getConfig();
            return parsedError;
        }

        // Expired token
        if (parsedError.error.code === 2003 && !API.refreshTokenPromise) {
            log.l('API-EXPIRED-TOKEN-ERROR');
            return await API.refreshTokenAndRefetch({
                url,
                params,
                method,
                headers,
                options,
                parsedError,
            });
        }

        // no token errors has been found -> going in the next catch
        throw parsedError;
    },

    defaultErrorHandler: async (parsedError) => {
        // [parsedError.error] can be string
        // TODO: StRef. BackEnd must handle this case. Can't send text for us
        // https://fs1-dev.fex.net:9090/upload/2000008759
        if (parsedError.error && !parsedError.error.code) {
            parsedError.error.code = 404;
        }
        if (parsedError.error.name === 'AbortError') {
            // if you rethrow this error:
            // { code: number, name: string, message: string }
            // it changes her structure  to
            // { message: string }
            throw Error(`NO_RETRY: ${parsedError.error.message}`);
        }
        log.l(`FETCH-ERROR =\n`, parsedError);
        return parsedError;
    },

    request: async ({
        endpoint = API.url(),
        url = '',
        params = '',
        method,
        options = {},
        headersOpts = {},
        signal,
        isForceRequest = false,
        customErrorHandler = (parsedError) => {
            throw parsedError;
        },
    }) => {
        // Check CACHE
        if (CACHE.isFetched(url, isForceRequest)) return;
        // We can not do any request until [store.users.refreshToken] ends
        await API.refreshTokenPromise;

        // anonToken has higher priority
        const fetchOptions = {
            method,
            headers: API.getHeaders(headersOpts),
            ...options,
            ...(signal && { signal }),
        };
        return fetch(endpoint + API.createURL(url, params), fetchOptions)
            .then(API.checkStatus)
            .then((response) => API.handleResponse(response, options))
            .catch((err) => API.parseError(err, options))
            .catch(customErrorHandler)
            .catch((parsedError) =>
                API.tokenErrorHandler({
                    parsedError,
                    url,
                    params,
                    method,
                    headersOpts,
                    options,
                })
            )
            .catch(API.defaultErrorHandler);
    },

    post: (data) => {
        // Add {credentials: 'include'} to all POST requests
        if (!data.options) data.options = {};
        Object.assign(data.options, { credentials: 'include' });
        const formatData = API.formatBody(data);

        return API.request({
            ...formatData,
            method: 'POST',
        });
    },

    patch: (data) => {
        // Doesn't need to convert in JSON (binary data in resp)
        return API.request({ ...data, method: 'PATCH' });
    },

    head: (data) => {
        // Doesn't need to convert in JSON (no body in resp)
        return API.request({ ...data, method: 'HEAD' });
    },

    put: (data) => {
        const formatData = API.formatBody(data);

        return API.request({ ...formatData, method: 'PUT' });
    },

    get: (data) => {
        return API.request({ ...data, method: 'GET' });
    },

    delete: (data) => {
        const formatData = API.formatBody(data);

        return API.request({ ...formatData, method: 'DELETE' });
    },

    abortable: ({ fetchFunc, fetchController }) => {
        return async () => {
            if (fetchController) fetchController.abort();

            fetchController = new AbortController();
            const response = await fetchFunc(fetchController);
            fetchController = undefined;

            return response;
        };
    },

    getDelay({ delayValues = [1000, 2000, 3000] } = {}) {
        const instance = {
            _attempt: 0,
            _value: delayValues,
            get value() {
                return instance._value[instance._attempt];
            },
            get isMoreAttempt() {
                return instance._attempt < instance._value.length;
            },
            get pause() {
                if (instance.isMoreAttempt) {
                    console.log(
                        '---> --->',
                        `Upload ${
                            instance._attempt
                        } failed, time ${new Date().getSeconds()} sec, retry after ${instance.value /
                            1000} sec`
                    );
                    return new Promise((resolve) =>
                        setTimeout(() => {
                            instance.incrementAttempt();
                            resolve();
                        }, instance.value)
                    );
                } else {
                    return Promise.resolve('There are no more attemps');
                }
            },
            incrementAttempt: () => {
                instance._attempt++;
            },
            reset() {
                instance._attempt = 0;
            },
        };
        return instance;
    },

    getHeaders(headersOpts) {
        const token =
            store.userToken.sessionSudosuToken ||
            store.userToken.authClientToken ||
            store.fs.shared.anonToken;

        return {
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            'Content-Type': 'application/json',
            ...headersOpts,
        };
    },
};

export default API;
