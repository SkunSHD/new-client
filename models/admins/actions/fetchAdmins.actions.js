import { flow } from 'mobx-state-tree';
// Utils
import API from '_core/utils/api.utils';

export default () => {
    return {
        fetchOrderTariffList: flow(function*({ url, options } = {}) {
            return yield API.get({ url, options });
        }),

        fetchDeleteOrderTariff: flow(function*(paymentRequestsIds = []) {
            return yield API.delete({
                url: 'billing/request-prem',
                options: {
                    body: {
                        payment_requests_ids: paymentRequestsIds,
                    },
                },
            });
        }),

        fetchConfirmOrderTariff: flow(function*(paymentRequestsIds = []) {
            return yield API.post({
                url: 'billing/request-prem',
                options: {
                    body: {
                        payment_requests_ids: paymentRequestsIds,
                    },
                },
            });
        }),

        fetchAdminsList: flow(function*() {
            return yield API.get({ url: 'list' });
        }),

        fetchAdminInfo: flow(function*(userId) {
            return yield API.get({ url: `${userId}` });
        }),

        fetchUpdatePermissionsAdmin: flow(function*({
            id = undefined,
            permissions = [],
        }) {
            return yield API.put({
                url: `update/${id}`,
                options: {
                    body: {
                        id,
                        permissions,
                    },
                },
            });
        }),

        fetchCreateNewAdmin: flow(function*(userId) {
            return yield API.post({ url: `set/${userId}` });
        }),

        fetchUsersList: flow(function*({ url, options } = {}) {
            return yield API.get({ url, options });
        }),

        fetchUserInfo: flow(function*(userId) {
            return yield API.get({ url: `users/${userId}` });
        }),

        fetchUpdateLicense: flow(function*({
            licenseId = undefined,
            paid_till = undefined,
        }) {
            return yield API.post({
                url: `users/set-license/${licenseId}`,
                options: {
                    body: {
                        paid_till,
                    },
                },
            });
        }),

        fetchUpdateSettings: flow(function*({
            userId,
            first_name = null,
            email = null,
            phone = null,
            password = null,
        }) {
            return yield API.put({
                url: `users/${userId}`,
                options: {
                    body: {
                        first_name,
                        email,
                        phone,
                        password,
                    },
                },
            });
        }),

        fetchLoginAsUser: flow(function*(userId) {
            return yield API.get({ url: `users/sudo-su/${userId}` });
        }),
    };
};
