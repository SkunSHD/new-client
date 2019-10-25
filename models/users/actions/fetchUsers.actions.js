import { flow } from 'mobx-state-tree';
// Utils
import API from '_core/utils/api.utils';
import log from '_core/utils/log.utils';

export default () => {
    return {
        fetchConfigAnon: flow(function*() {
            log.l('GET-ANON');
            const anon = yield API.get({
                endpoint: API.url({ urlPrefix: API.CLIENT_URL_PREFIX }),
                url: 'config/anonymous',
            });

            if (!anon) return log.l('GET-ANON-ERROR', anon);

            log.l('GET-ANON-SUCCESS', anon);
            return anon;
        }),

        fetchConfigUser: flow(function*() {
            return yield API.get({ url: 'config/user' });
        }),

        fetchConfigBilling: flow(function*() {
            return yield API.get({ url: 'config/billing' });
        }),

        fetchRequestPasswordRecovery: flow(function*({ email = '' }) {
            return yield API.post({
                url: 'user/request-password-recovery',
                options: {
                    body: { email },
                },
            });
        }),

        fetchRecoverPassword: flow(function*(signature = '') {
            return yield API.post({
                url: `user/recover-password/${signature}`,
            });
        }),

        fetchRequestDelete: flow(function*({ password = '' }) {
            return yield API.post({
                url: 'user/request-delete',
                options: {
                    body: { password },
                },
            });
        }),

        fetchDeleteAccount: flow(function*({ code = '', password = '' }) {
            return yield API.post({
                url: 'user/delete',
                options: {
                    body: { code, password },
                },
            });
        }),
    };
};
