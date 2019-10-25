import { types } from 'mobx-state-tree';

const ChangeFirstNameFormModel = {
    first_name: types.maybeNull(types.string),
    rebill_is_active: types.optional(types.boolean, false),
    GDPR: types.optional(types.boolean, false),
};

export default types.model(
    'ChangeFirstNameFormModel',
    ChangeFirstNameFormModel
);
