import { types } from 'mobx-state-tree';

const ChangePhoneStep2FormModel = {
    phone: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    code: types.optional(types.string, ''),
    isPasswordShow: types.optional(types.boolean, false),
};

export default types.model(
    'ChangePhoneStep2FormModel',
    ChangePhoneStep2FormModel
);
