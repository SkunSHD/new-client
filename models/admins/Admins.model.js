import { types } from 'mobx-state-tree';
// Utils
import adminPermissions from '_core/utils/adminPermissions.utils';
// Actions
import dataActions from '_core/models/admins/actions/dataAdmins.actions';
import fetchActions from '_core/models/admins/actions/fetchAdmins.actions';
import logicActions from '_core/models/admins/actions/logicAdmins.actions';

const AdminsModel = {};

const views = (self) => {
    return {
        get isAdmin() {
            return self.currentAuthUser && !!self.currentAuthUser.permissions;
        },

        access(permissions) {
            return adminPermissions.formatted(permissions);
        },

        get authUserAccess() {
            return self.access(self.currentAuthUser.permissions);
        },

        hasAccesWatchAllAdmins(permissions) {
            return permissions.has('watchAllAdmins');
        },

        hasCreateNewAdmin(permissions) {
            return permissions.has('createNewAdmin');
        },

        hasUpdateLicense(permissions) {
            return permissions.has('updateLicense');
        },

        hasUpdateAdminProfile(permissions) {
            return permissions.has('updateAdminProfile');
        },

        hasWatchAllUsers(permissions) {
            return permissions.has('watchAllUsers');
        },

        hasSudosu(permissions) {
            return permissions.has('sudosu');
        },

        hasСanViewVouchersSudosu(permissions) {
            return permissions.has('canViewVouchers');
        },

        hasСanEditUser(permissions) {
            return permissions.has('canEditUser');
        },
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        ...dataActions(self),
        ...fetchActions(self),
        ...logicActions(self),
    };
};

export default types
    .model('AdminsModel', AdminsModel)
    .views(views)
    .actions(actions);
