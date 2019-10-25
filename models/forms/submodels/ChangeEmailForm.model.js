import { types } from 'mobx-state-tree';

const ChangePasswordFormModel = {
    oldEmail: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    hasUserEmail: types.optional(types.boolean, false),
};

export default types.model('ChangePasswordFormModel', ChangePasswordFormModel);
