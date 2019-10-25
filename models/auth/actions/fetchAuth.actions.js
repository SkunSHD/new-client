import { flow } from 'mobx-state-tree';
// Utils
import API from '_core/utils/api.utils';

const matchEmail = (string) => {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(string);
};

export default () => {
    return {
        fetchSignin: flow(function*({
            password = '',
            phone = '',
            login = '',
            isAuthByPhone = true,
        }) {
            const emailOrLogin = matchEmail(login) ? 'email' : 'login';

            return yield API.post({
                endpoint: API.url({ urlPrefix: API.CLIENT_URL_PREFIX }),
                url: 'auth/signin',
                options: {
                    body: {
                        password,
                        ...(phone && isAuthByPhone && { phone }),
                        ...(login &&
                            !isAuthByPhone && { [emailOrLogin]: login }),
                    },
                },
            });
        }),

        fetchSignout: flow(function*() {
            return yield API.post({
                endpoint: API.url({ urlPrefix: API.CLIENT_URL_PREFIX }),
                url: 'auth/signout',
            });
        }),

        fetchSignoutAll: flow(function*() {
            return yield API.post({
                endpoint: API.url({ urlPrefix: API.CLIENT_URL_PREFIX }),
                url: 'auth/signout-all',
            });
        }),

        fetchScaffold: flow(function*({
            email = '',
            password = '',
            first_name = '',
        }) {
            return yield API.post({
                url: 'auth/registration-email',
                options: {
                    body: { email, password, first_name },
                },
            });
        }),

        fetchConfirmEmail: flow(function*(signature = '') {
            return yield API.post({
                url: `auth/confirm-email/${signature}`,
            });
        }),

        fetchFBSignup: flow(function*({
            access_token = '',
            social_id = '',
            app_id = '',
        }) {
            return yield API.post({
                url: 'auth/fb/signup',
                options: {
                    body: { access_token, social_id, app_id },
                },
            });
        }),

        fetchFBSignin: flow(function*({
            access_token = '',
            social_id = '',
            app_id = '',
        }) {
            return yield API.post({
                url: 'auth/fb/signin',
                options: {
                    body: { access_token, social_id, app_id },
                },
            });
        }),

        fetchGoogleSignup: flow(function*({
            access_token = '',
            social_id = '',
            app_id = '',
        }) {
            return yield API.post({
                url: 'auth/google/signup',
                options: {
                    body: { access_token, social_id, app_id },
                },
            });
        }),

        fetchGoogleSignin: flow(function*({
            access_token = '',
            social_id = '',
            app_id = '',
        }) {
            return yield API.post({
                url: 'auth/google/signin',
                options: {
                    body: { access_token, social_id, app_id },
                },
            });
        }),

        fetchVKSignup: flow(function*({
            access_token = '',
            user_id = '',
            app_id = '',
            email = '',
        }) {
            return yield API.post({
                url: 'auth/vk/signup',
                options: {
                    body: { access_token, user_id, app_id, email },
                },
            });
        }),

        fetchVKSignin: flow(function*({
            access_token = '',
            user_id = '',
            app_id = '',
        }) {
            return yield API.post({
                url: 'auth/vk/signin',
                options: {
                    body: { access_token, user_id, app_id },
                },
            });
        }),
    };
};
