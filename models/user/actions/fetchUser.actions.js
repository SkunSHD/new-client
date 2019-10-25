import { flow } from 'mobx-state-tree';
// Utils
import API from '_core/utils/api.utils';

export default () => {
    return {
        fetchSaveSettings: flow(function*({
            first_name = '',
            rebill_is_active = false,
            GDPR = false,
        }) {
            return yield API.put({
                url: 'user/save-settings',
                options: {
                    body: { first_name, rebill_is_active, GDPR },
                },
            });
        }),

        // Call with empty paramenters will delete settings
        // fetchSaveCustomSettings() === fetchDeleteCustomSettings()
        fetchSaveCustomSettings(settings = {}) {
            return API.post({
                url: 'user/settings',
                options: {
                    body: {
                        key: '32:0:4',
                        config: settings,
                    },
                },
            });
        },

        fetchCustomSettings() {
            return API.get({
                url: 'user/settings',
                params: {
                    key: '32:0:4',
                },
            });
        },

        fetchRequestPhoneChange: flow(function*({ phone = '', password = '' }) {
            return yield API.post({
                url: 'user/request-phone-change',
                options: {
                    body: {
                        phone,
                        ...(password && { password }),
                    },
                },
            });
        }),

        fetchChangePhone: flow(function*({
            code = '',
            password = '',
            phone = '',
        }) {
            return yield API.put({
                url: 'user/change-phone',
                options: {
                    body: {
                        phone,
                        code,
                        ...(password && { password }),
                    },
                },
            });
        }),

        fetchChangePassword: flow(function*({
            password_old = '',
            password = '',
        }) {
            return yield API.post({
                url: 'user/change-password',
                options: {
                    body: {
                        ...(password_old && { password_old }),
                        password,
                    },
                },
            });
        }),

        fetchChangeEmail: flow(function*({ email = '' }) {
            return yield API.post({
                url: 'user/change-email',
                options: {
                    body: {
                        email,
                    },
                },
            });
        }),

        fetchSaveFlags: flow(function*({ flags = '', xor = '', or = '' }) {
            return yield API.put({
                url: 'user/save-flags',
                options: {
                    body: {
                        flags,
                        xor,
                        or,
                    },
                },
            });
        }),
    };
};
