import { types } from 'mobx-state-tree';

const ChangeFlagsFormModel = {
    subscribe: types.optional(types.boolean, false),
};

export default types.model('ChangeFlagsFormModel', ChangeFlagsFormModel);
