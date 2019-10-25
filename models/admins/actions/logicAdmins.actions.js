import { flow } from 'mobx-state-tree';

export default (self) => {
    return {
        getOrderTariffList: flow(function*({ url, options } = {}) {
            return yield self.fetchOrderTariffList({
                url,
                options,
            });
        }),

        deleteOrderTariff: flow(function*(data) {
            return yield self.fetchDeleteOrderTariff(data);
        }),

        confirmOrderTariff: flow(function*(data) {
            return yield self.fetchConfirmOrderTariff(data);
        }),

        getAdminsList: flow(function*() {
            const response = yield self.fetchAdminsList();

            if (response.error) return response;

            return response;
        }),

        getAdminById: flow(function*(userId) {
            const admin = yield self.fetchAdminInfo(userId);

            if (admin.error) return admin;

            self.createUser({ admin });

            return admin;
        }),

        updatePermissionsAdmin: flow(function*(data) {
            const response = yield self.fetchUpdatePermissionsAdmin(data);

            if (response.error) return response;

            return response;
        }),

        createNewAdmin: flow(function*(userId) {
            const admin = yield self.fetchCreateNewAdmin(userId);

            if (admin.error) return admin;

            self.getExistUser(admin.id).update({ ...admin });

            return admin;
        }),

        getUsersList: flow(function*({ url, options } = {}) {
            return yield self.fetchUsersList({
                url,
                options,
            });
        }),

        getUserById: flow(function*(userId) {
            const user = yield self.fetchUserInfo(userId);

            if (user.error) return user;

            self.createUser({ user });

            return user;
        }),

        updateUserLicense: flow(function*({ licenseId, paid_till }) {
            return yield self.fetchUpdateLicense({
                licenseId,
                paid_till,
            });
        }),

        updateUserSettings: flow(function*({
            userId,
            first_name,
            email,
            phone,
            password,
        }) {
            return yield self.fetchUpdateSettings({
                userId,
                first_name,
                email,
                phone,
                password,
            });
        }),

        loginAsUser: flow(function*(userId) {
            return yield self.fetchLoginAsUser(userId);
        }),
    };
};
