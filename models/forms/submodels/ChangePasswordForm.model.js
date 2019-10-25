import { types } from 'mobx-state-tree';

const ChangePasswordFormModel = {
    password_old: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    confirmPassword: types.optional(types.string, ''),
    isOldPasswordShow: types.optional(types.boolean, false),
    isNewPasswordShow: types.optional(types.boolean, false),
    isConfirmPasswordShow: types.optional(types.boolean, false),
    isAuthSocial: types.optional(types.boolean, false),
};

export default types.model('ChangePasswordFormModel', ChangePasswordFormModel);
