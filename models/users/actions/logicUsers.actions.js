import { flow, getParent } from 'mobx-state-tree';
// Utils
import { getModifiedUserData } from '_core/utils/userDataValidation';

export default (self) => {
    return {
        getConfigAnon: flow(function*() {
            const response = yield self.fetchConfigAnon();

            if (response.error) return response;

            const { anonymous } = response;

            self.currentAuthUser.update({ ...anonymous });
        }),

        getConfigUser: flow(function*() {
            const response = yield self.fetchConfigUser();

            if (response.error) return response;

            const { user } = response;
            const modifiedData = getModifiedUserData(user);

            self.currentAuthUser.update({ ...modifiedData });
        }),

        getConfigBilling: flow(function*() {
            const response = yield self.fetchConfigBilling();

            if (response.error) return response;

            const { billing } = response;

            self.currentAuthUser.update({ ...billing });
        }),

        recPasswordStep1: flow(function*(data) {
            const response = yield self.fetchRequestPasswordRecovery(data);

            if (response.error) return response;
            return response;
        }),

        recPasswordStep2: flow(function*(data) {
            const response = yield self.fetchRecoverPassword(data);

            if (response.error) return response;
            return response;
        }),

        deleteAccountStep1: flow(function*(data) {
            return yield self.fetchRequestDelete(data);
        }),

        deleteAccountStep2: flow(function*(data) {
            const response = yield self.fetchDeleteAccount(data);

            if (response.error) return response;

            getParent(self).removeUserData();
            getParent(self).getConfig();

            return response;
        }),
    };
};
