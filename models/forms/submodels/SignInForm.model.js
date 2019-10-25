import { types } from 'mobx-state-tree';

const SignInFormModel = {
    isAuthByPhone: types.boolean,
    isPasswordShow: types.boolean,
    phone: types.optional(types.string, ''),
    login: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    dontRemember: types.optional(types.boolean, false),
    isPhoneInvalid: types.optional(types.boolean, true),
};

export default types.model('SignInFormModel', SignInFormModel);
