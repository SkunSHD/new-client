import { types } from 'mobx-state-tree';

const RebillUpdateFormModel = {
    rebill_is_active: types.optional(types.boolean, false),
    GDPR: types.optional(types.boolean, false),
};

export default types.model('RebillUpdateFormModel', RebillUpdateFormModel);
