import { types } from 'mobx-state-tree';
// Actions
import dataActions from '_core/models/users/actions/dataUsers.actions';
import fetchActions from '_core/models/users/actions/fetchUsers.actions';
import logicActions from '_core/models/users/actions/logicUsers.actions';
// utils
import array from '_core/utils/array.utils';
// Models
import AdminsModel from '_core/models/admins/Admins.model';
import UserModel from '_core/models/user/User.model';

const UsersModel = types.model({
    all: types.optional(types.map(UserModel), {}),
    authUserId: types.string,
});

// model mutations goes only in actions
const actions = (self) => {
    return {
        ...dataActions(self),
        ...fetchActions(self),
        ...logicActions(self),
    };
};

const views = (self) => {
    return {
        get currentAuthUser() {
            return self.all.get(self.authUserId);
        },

        get isAuthUser() {
            return self.authUserId !== 'anonymous';
        },

        get isTrial() {
            return (
                this.isAuthUser &&
                array.head(self.currentAuthUser.currentTariff).is_trial
            );
        },

        get hasGDPR() {
            return self.currentAuthUser.GDPR;
        },

        isExistUser(id) {
            return self.all.has(id);
        },

        getExistUser(id) {
            return self.all.get(id);
        },

        sortByCreateDate(users) {
            return users.sort((a, b) => b.created_at - a.created_at);
        },
    };
};

export default types
    .compose(
        AdminsModel,
        UsersModel
    )
    .views(views)
    .actions(actions);
