import { types } from 'mobx-state-tree';

const DeleteAccountStep2FormModel = {
    password: types.optional(types.string, ''),
    code: types.optional(types.string, ''),
    isPasswordShow: types.optional(types.boolean, false),
};

export default types.model(
    'DeleteAccountStep2FormModel',
    DeleteAccountStep2FormModel
);
