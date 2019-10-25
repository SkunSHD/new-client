import { types } from 'mobx-state-tree';

const AdminInfoFormModel = {
    watchAllAdmins: types.optional(types.boolean, false),
    createNewAdmin: types.optional(types.boolean, false),
    updateAdminProfile: types.optional(types.boolean, false),
    watchAllUsers: types.optional(types.boolean, false),
    updateLicense: types.optional(types.boolean, false),
    sudosu: types.optional(types.boolean, false),
    canViewVouchers: types.optional(types.boolean, false),
    canEditUser: types.optional(types.boolean, false),
};

export default types.model('AdminInfoFormModel', AdminInfoFormModel);
