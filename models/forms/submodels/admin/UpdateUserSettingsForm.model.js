import { types } from 'mobx-state-tree';

const UpdateUserSettingsFormModel = {
    first_name: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    phone: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    isPasswordShow: types.optional(types.boolean, false),
};

export default types.model(
    'UpdateUserSettingsFormModel',
    UpdateUserSettingsFormModel
);
